import { NextResponse } from "next/server";
import { connectDB, isDbConfigured } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { Organization } from "@/lib/db/models/Organization";
import { Monitor } from "@/lib/db/models/Monitor";
import { Incident } from "@/lib/db/models/Incident";
import { SupportTicket } from "@/lib/db/models/SupportTicket";
import { Payment } from "@/lib/db/models/Subscription";
import { SchedulerState } from "@/lib/db/models/SchedulerState";
import { NotificationDelivery } from "@/lib/db/models/NotificationDelivery";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "platform_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  await connectDB();

  const [
    totalUsers,
    totalOrganizations,
    totalMonitors,
    activeIncidents,
    activeSubscriptions,
    openTickets,
    notificationFailures,
    workerState,
    recentPayments,
  ] = await Promise.all([
    User.countDocuments({ deletedAt: null }),
    Organization.countDocuments({ deletedAt: null }),
    Monitor.countDocuments({ deletedAt: null }),
    Incident.countDocuments({ isActive: true }),
    Organization.countDocuments({
      subscriptionStatus: { $in: ["active", "trialing"] },
    }),
    SupportTicket.countDocuments({ status: { $in: ["open", "in_progress"] } }),
    NotificationDelivery.countDocuments({
      status: "failed",
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    }),
    SchedulerState.findOne({ key: "primary" }).lean(),
    Payment.find({ status: "succeeded" })
      .sort({ paidAt: -1 })
      .limit(20)
      .lean(),
  ]);

  const revenueCents = recentPayments.reduce((s, p) => s + (p.amount || 0), 0);

  const workerHealthy =
    workerState?.lastHeartbeatAt &&
    Date.now() - new Date(workerState.lastHeartbeatAt).getTime() < 60_000;

  return NextResponse.json({
    totalUsers,
    totalOrganizations,
    totalMonitors,
    activeIncidents,
    activeSubscriptions,
    openTickets,
    notificationFailures,
    revenueRecent: revenueCents,
    worker: {
      status: workerState?.status || "unknown",
      workerId: workerState?.workerId || null,
      lastHeartbeatAt: workerState?.lastHeartbeatAt || null,
      healthy: Boolean(workerHealthy),
    },
  });
}
