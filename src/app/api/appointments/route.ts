import { NextRequest } from "next/server";
import { requireRole } from "../../../../backend/middlewares/role.middleware";
import { successResponse, errorResponse } from "../../../../backend/utils/response";
import {
  bookAppointment,
  getAppointments,
  getStats,
  AppointmentServiceError,
} from "../../../../backend/services/appointment.service";
import {
  createAppointmentSchema,
  queryAppointmentSchema,
} from "../../../../backend/validations/appointment.validation";
import prisma from "../../../../backend/config/db";
import { notifyAppointmentBooked } from "../../../../backend/services/notification.service";

const ALLOWED_ROLES = ["HOSPITAL_ADMIN", "RECEPTIONIST", "STAFF", "DOCTOR", "SUB_DEPT_HEAD", "DEPT_HEAD", "SUPER_ADMIN"];

export const dynamic = "force-dynamic";

// GET /api/appointments
export async function GET(req: NextRequest) {
  const auth = await requireRole(req, ALLOWED_ROLES);
  if (auth.error) return auth.error;

  try {
    const { searchParams } = new URL(req.url);

    if (searchParams.get("stats") === "true") {
      const stats = await getStats(auth.hospitalId || searchParams.get("hospitalId") || "");
      return successResponse(stats, "Appointment statistics");
    }

    const queryParams = {
      search: searchParams.get("search") || undefined,
      doctorId: searchParams.get("doctorId") || undefined,
      patientId: searchParams.get("patientId") || undefined,
      departmentId: searchParams.get("departmentId") || undefined,
      subDepartmentId: searchParams.get("subDepartmentId") || undefined,
      status: searchParams.get("status") || undefined,
      type: searchParams.get("type") || undefined,
      date: searchParams.get("date") || undefined,
      dateFrom: searchParams.get("dateFrom") || undefined,
      dateTo: searchParams.get("dateTo") || undefined,
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "20",
      sortBy: searchParams.get("sortBy") || "appointmentDate",
      sortOrder: searchParams.get("sortOrder") || "asc",
    };

    const validated = queryAppointmentSchema.safeParse(queryParams);
    if (!validated.success) {
      return errorResponse("Invalid query parameters", 400, validated.error.issues);
    }

    const result = await getAppointments({ hospitalId: auth.hospitalId || searchParams.get("hospitalId") || undefined, ...validated.data });
    return successResponse(result, "Appointments fetched");
  } catch (e: any) {
    return errorResponse(e.message, 500);
  }
}

// POST /api/appointments
export async function POST(req: NextRequest) {
  const auth = await requireRole(req, ALLOWED_ROLES);
  if (auth.error) return auth.error;

  try {
    const body = await req.json();
    const result = createAppointmentSchema.safeParse(body);
    if (!result.success) {
      return errorResponse("Validation failed", 400, result.error.issues);
    }

    const targetHospitalId = auth.hospitalId || body.hospitalId || (result.data as any).hospitalId;
    if (!targetHospitalId) return errorResponse("Hospital ID is required", 400);

    const hospital = await prisma.hospital.findUnique({
      where: { id: targetHospitalId },
      select: { name: true },
    });

    const appointment = await bookAppointment(
      targetHospitalId,
      hospital?.name || "Hospital",
      result.data
    );
    // fire-and-forget notification
    notifyAppointmentBooked(targetHospitalId, {
      patientName: (appointment as any).patient?.name || "Patient",
      doctorName:  (appointment as any).doctor?.name  || "Doctor",
      date: new Date((appointment as any).appointmentDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      time: (appointment as any).timeSlot || "",
    }).catch(() => {});
    return successResponse(appointment, "Appointment booked successfully", 201);
  } catch (e: any) {
    if (e instanceof AppointmentServiceError) {
      return errorResponse(e.message, e.status, { code: e.code });
    }
    return errorResponse(e.message, 500);
  }
}
