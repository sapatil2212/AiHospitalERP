import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "../../../../backend/utils/response";
import { authMiddleware } from "../../../../backend/middlewares/auth.middleware";
import prisma from "../../../../backend/config/db";
import { randomUUID } from "crypto";
import nodemailer from "nodemailer";

/**
 * The DemoRequest table is created on demand via raw SQL so the feature works
 * even if `prisma migrate` / `prisma generate` hasn't been run for this model.
 * This mirrors the approach used by the Enquiry endpoints.
 */
async function ensureTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS DemoRequest (
      id            VARCHAR(191) NOT NULL,
      hospitalName  VARCHAR(255) NOT NULL,
      adminName     VARCHAR(255) NOT NULL,
      email         VARCHAR(255) NOT NULL,
      mobile        VARCHAR(50)  NOT NULL,
      city          VARCHAR(255) NULL,
      preferredDate DATE NULL,
      preferredTime VARCHAR(30) NULL,
      message       TEXT NULL,
      status        VARCHAR(30) NOT NULL DEFAULT 'NEW',
      notes         TEXT NULL,
      createdAt     DATETIME(3) NOT NULL,
      updatedAt     DATETIME(3) NOT NULL,
      PRIMARY KEY (id),
      INDEX DemoRequest_status_idx (status),
      INDEX DemoRequest_createdAt_idx (createdAt)
    )
  `);
}

function formatDate(date: string) {
  try {
    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
  } catch {
    return date;
  }
}

function formatTime(time: string) {
  if (time && time.includes(":")) {
    const [h, m] = time.split(":");
    const hour = parseInt(h, 10);
    return `${hour % 12 || 12}:${m} ${hour < 12 ? "AM" : "PM"}`;
  }
  return time;
}

/** Fire-and-forget notification emails (won't block or fail the request). */
async function sendDemoEmails(data: {
  hospitalName: string; adminName: string; email: string; mobile: string;
  city?: string; preferredDate: string; preferredTime: string; message?: string;
}) {
  const emailUsername = (process.env.EMAIL_USERNAME || "").trim();
  const emailPassword = (process.env.EMAIL_PASSWORD || "").replace(/\s/g, "");
  if (!process.env.EMAIL_HOST || !emailUsername || !emailPassword) {
    console.log("[Demo Request] SMTP not configured — skipping emails");
    return;
  }

  const SUPER_ADMIN_EMAIL =
    process.env.SUPER_ADMIN_EMAIL || process.env.HOSPITAL_EMAIL || emailUsername;
  const senderEmail = emailUsername || "no-reply@aihospitalerp.com";
  const year = new Date().getFullYear();
  const fDate = formatDate(data.preferredDate);
  const fTime = formatTime(data.preferredTime);

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: { user: emailUsername, pass: emailPassword },
  });

  const userHtml = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f5f7fa;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fa;padding:40px 16px;"><tr><td align="center">
<table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;background:#fff;border-radius:14px;border:1px solid #e5e7eb;overflow:hidden;">
<tr><td style="padding:28px 36px 20px;background:linear-gradient(135deg,#7C3AED,#6D28D9);">
<p style="margin:0 0 2px;font-size:11px;font-weight:600;color:#ddd6fe;letter-spacing:.08em;text-transform:uppercase;">AiHospitalERP</p>
<h1 style="margin:0;font-size:20px;font-weight:700;color:#fff;">Demo Request Received</h1></td></tr>
<tr><td style="padding:28px 36px;">
<p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.6;">Hi <strong>${data.adminName}</strong>,</p>
<p style="margin:0 0 20px;font-size:14px;color:#6b7280;line-height:1.65;">Thank you for requesting a demo of AiHospitalERP for <strong>${data.hospitalName}</strong>. Our team will reach out shortly to confirm your slot.</p>
<table cellpadding="0" cellspacing="0" style="width:100%;background:#f5f3ff;border-radius:10px;border:1px solid #ede9fe;margin-bottom:20px;"><tr><td style="padding:16px 20px;">
<p style="margin:0 0 6px;font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;">Preferred Date</p>
<p style="margin:0 0 14px;font-size:16px;font-weight:700;color:#6d28d9;">${fDate}</p>
<p style="margin:0 0 6px;font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;">Preferred Time</p>
<p style="margin:0;font-size:16px;font-weight:700;color:#6d28d9;">${fTime}</p></td></tr></table>
<p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">If you have any urgent questions, just reply to this email.</p></td></tr>
<tr><td style="padding:16px 36px 24px;border-top:1px solid #f3f4f6;text-align:center;"><p style="margin:0;font-size:11px;color:#d1d5db;">&copy; ${year} AiHospitalERP &middot; Automated confirmation.</p></td></tr>
</table></td></tr></table></body></html>`;

  const row = (k: string, v: string) =>
    `<tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#6b7280;width:130px;">${k}</td><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:14px;font-weight:600;color:#111827;">${v}</td></tr>`;

  const adminHtml = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f5f7fa;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fa;padding:40px 16px;"><tr><td align="center">
<table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;background:#fff;border-radius:14px;border:1px solid #e5e7eb;overflow:hidden;">
<tr><td style="padding:28px 36px 20px;background:linear-gradient(135deg,#0F172A,#1E293B);"><h1 style="margin:0;font-size:20px;font-weight:700;color:#fff;">New Demo Request 🚀</h1></td></tr>
<tr><td style="padding:28px 36px;">
<p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.6;">A new demo request was submitted from the Contact page.</p>
<table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin-bottom:8px;">
${row("Hospital", data.hospitalName)}
${row("Contact Name", data.adminName)}
${row("Email", `<a href="mailto:${data.email}" style="color:#3b82f6;text-decoration:none;">${data.email}</a>`)}
${row("Phone", data.mobile)}
${data.city ? row("City", data.city) : ""}
${row("Pref. Date", fDate)}
${row("Pref. Time", fTime)}
${data.message ? row("Message", data.message) : ""}
</table></td></tr></table></td></tr></table></body></html>`;

  await Promise.all([
    transporter.sendMail({
      from: `"AiHospitalERP" <${senderEmail}>`,
      to: data.email,
      subject: "Demo Request Received - AiHospitalERP",
      html: userHtml,
    }),
    transporter.sendMail({
      from: `"AiHospitalERP Website" <${senderEmail}>`,
      to: SUPER_ADMIN_EMAIL,
      subject: `New Demo Request: ${data.hospitalName} (${data.adminName})`,
      html: adminHtml,
    }),
  ]);
}

/**
 * POST /api/demo-requests — Public: submit a demo / contact request.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      hospitalName, adminName, email, mobile,
      city, preferredDate, preferredTime, message,
    } = body;

    if (!hospitalName?.trim() || !adminName?.trim() || !email?.trim() || !mobile?.trim()) {
      return errorResponse("Hospital name, your name, email and mobile are required", 400);
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return errorResponse("A valid email address is required", 400);
    }

    await ensureTable();

    const id = randomUUID();
    const now = new Date();
    const dateValue = preferredDate ? new Date(preferredDate) : null;

    await prisma.$executeRawUnsafe(
      `INSERT INTO DemoRequest (id, hospitalName, adminName, email, mobile, city, preferredDate, preferredTime, message, status, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'NEW', ?, ?)`,
      id,
      hospitalName.trim(), adminName.trim(), email.trim(), mobile.trim(),
      city?.trim() || null,
      dateValue, preferredTime?.trim() || null,
      message?.trim() || null,
      now, now,
    );

    // Non-blocking notification emails
    sendDemoEmails({
      hospitalName: hospitalName.trim(),
      adminName: adminName.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      city: city?.trim() || "",
      preferredDate: preferredDate || "",
      preferredTime: preferredTime || "",
      message: message?.trim() || "",
    }).catch((err) => console.error("[Demo Request] Email error:", err?.message));

    return successResponse({ id }, "Demo request submitted successfully", 201);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("POST /api/demo-requests error:", msg);
    return errorResponse(msg || "Failed to submit demo request", 500);
  }
}

/**
 * GET /api/demo-requests — Super Admin: list demo requests with stats.
 */
export async function GET(req: NextRequest) {
  const { user, error } = await authMiddleware(req);
  if (error) return error;
  if (user!.role !== "SUPER_ADMIN") {
    return errorResponse("Forbidden: Super Admin access required", 403);
  }

  try {
    await ensureTable();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;

    let whereClause = "WHERE 1=1";
    const params: (string | number)[] = [];
    if (status) { whereClause += " AND status = ?"; params.push(status); }
    if (search) {
      whereClause += " AND (hospitalName LIKE ? OR adminName LIKE ? OR email LIKE ? OR mobile LIKE ?)";
      const like = `%${search}%`;
      params.push(like, like, like, like);
    }

    const requests = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT * FROM DemoRequest ${whereClause} ORDER BY createdAt DESC`,
      ...params
    );

    const statsResult = await prisma.$queryRawUnsafe<{ status: string; cnt: bigint }[]>(
      `SELECT status, COUNT(*) as cnt FROM DemoRequest GROUP BY status`
    );
    const statsMap: Record<string, number> = {};
    for (const r of statsResult) statsMap[r.status] = Number(r.cnt);

    return successResponse({
      requests,
      stats: {
        new: statsMap["NEW"] || 0,
        contacted: statsMap["CONTACTED"] || 0,
        scheduled: statsMap["SCHEDULED"] || 0,
        converted: statsMap["CONVERTED"] || 0,
        closed: statsMap["CLOSED"] || 0,
        total: Object.values(statsMap).reduce((a, b) => a + b, 0),
      },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("GET /api/demo-requests error:", msg);
    return errorResponse(msg || "Failed to fetch demo requests", 500);
  }
}
