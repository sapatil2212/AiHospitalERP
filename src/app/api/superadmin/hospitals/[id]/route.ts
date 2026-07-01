import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "../../../../../../backend/middlewares/auth.middleware";
import prisma from "../../../../../../backend/config/db";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult.error || authResult.user?.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Super Admin access required." },
        { status: 403 }
      );
    }

    const hospital = await (prisma as any).hospital.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            patients: true,
            doctors: true,
            staffMembers: true,
            appointments: true,
            departments: true,
          },
        },
      },
    });

    if (!hospital) {
      return NextResponse.json(
        { success: false, message: "Hospital not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...hospital,
        patients: hospital._count.patients,
        doctors: hospital._count.doctors,
        staff: hospital._count.staffMembers,
        appointments: hospital._count.appointments,
        departments: hospital._count.departments,
      },
    });
  } catch (error: any) {
    console.error("Get hospital error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch hospital" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult.error || authResult.user?.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Super Admin access required." },
        { status: 403 }
      );
    }

    const hospital = await (prisma as any).hospital.findUnique({
      where: { id: params.id },
    });

    if (!hospital) {
      return NextResponse.json(
        { success: false, message: "Hospital not found" },
        { status: 404 }
      );
    }

    await (prisma as any).hospital.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: `Hospital "${hospital.name}" deleted successfully`,
    });
  } catch (error: any) {
    console.error("Delete hospital error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete hospital" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult.error || authResult.user?.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Super Admin access required." },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await req.json();

    const hospital = await (prisma as any).hospital.findUnique({
      where: { id },
    });

    if (!hospital) {
      return NextResponse.json(
        { success: false, message: "Hospital not found" },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.mobile !== undefined) updateData.mobile = body.mobile;
    if (body.isVerified !== undefined) updateData.isVerified = body.isVerified;

    if (body.trialStartDate !== undefined) {
      updateData.trialStartDate = body.trialStartDate ? new Date(body.trialStartDate) : null;
    }
    if (body.trialEndDate !== undefined) {
      updateData.trialEndDate = body.trialEndDate ? new Date(body.trialEndDate) : null;
    }

    if (body.subscriptionStatus !== undefined) {
      updateData.subscriptionStatus = body.subscriptionStatus;
    }
    if (body.subscriptionPlan !== undefined) {
      updateData.subscriptionPlan = body.subscriptionPlan || null;
    }
    if (body.billingCycle !== undefined) {
      updateData.billingCycle = body.billingCycle || null;
    }

    if (body.subscriptionStartDate !== undefined) {
      updateData.subscriptionStartDate = body.subscriptionStartDate ? new Date(body.subscriptionStartDate) : null;
    }
    if (body.subscriptionEndDate !== undefined) {
      updateData.subscriptionEndDate = body.subscriptionEndDate ? new Date(body.subscriptionEndDate) : null;
    }

    const updated = await (prisma as any).hospital.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: `Hospital "${updated.name}" updated successfully`,
      data: updated,
    });
  } catch (error: any) {
    console.error("Update hospital error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update hospital" },
      { status: 500 }
    );
  }
}

