import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "../../../../../backend/utils/response";
import { authMiddleware } from "../../../../../backend/middlewares/auth.middleware";
import prisma from "../../../../../backend/config/db";

const VALID_STATUSES = ["NEW", "CONTACTED", "SCHEDULED", "CONVERTED", "CLOSED"];

async function requireSuperAdmin(req: NextRequest) {
  const { user, error } = await authMiddleware(req);
  if (error) return { user: null, error };
  if (user!.role !== "SUPER_ADMIN") {
    return { user: null, error: errorResponse("Forbidden: Super Admin access required", 403) };
  }
  return { user: user!, error: null };
}

// PATCH /api/demo-requests/[id] — update status / notes
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireSuperAdmin(req);
  if (error) return error;

  try {
    const { id } = await params;
    const { status, notes } = await req.json();

    const sets: string[] = [];
    const vals: (string | Date)[] = [];
    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) return errorResponse("Invalid status", 400);
      sets.push("status = ?"); vals.push(status);
    }
    if (notes !== undefined) { sets.push("notes = ?"); vals.push(notes); }
    if (!sets.length) return errorResponse("Nothing to update", 400);

    sets.push("updatedAt = ?"); vals.push(new Date());

    await prisma.$executeRawUnsafe(
      `UPDATE DemoRequest SET ${sets.join(", ")} WHERE id = ?`,
      ...vals, id
    );

    const updated = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT * FROM DemoRequest WHERE id = ? LIMIT 1`, id
    );
    if (!updated.length) return errorResponse("Demo request not found", 404);

    return successResponse(updated[0], "Demo request updated");
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return errorResponse(msg || "Failed to update demo request", 500);
  }
}

// DELETE /api/demo-requests/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireSuperAdmin(req);
  if (error) return error;

  try {
    const { id } = await params;
    await prisma.$executeRawUnsafe(`DELETE FROM DemoRequest WHERE id = ?`, id);
    return successResponse(null, "Demo request deleted");
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return errorResponse(msg || "Failed to delete demo request", 500);
  }
}
