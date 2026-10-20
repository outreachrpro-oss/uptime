import { AlertChannel } from "@/lib/db/models/AlertChannel";
import { Monitor } from "@/lib/db/models/Monitor";
import { Incident } from "@/lib/db/models/Incident";
import { NotificationDelivery } from "@/lib/db/models/NotificationDelivery";
import { decryptSecret } from "@/lib/security/crypto";
import { sendEmail } from "./email";
import { sendSlackWebhook, sendDiscordWebhook, sendSignedWebhook } from "./webhooks";
import { appConfig } from "@/lib/config";

export interface AlertJobData {
  monitorId: string;
  organizationId: string;
  incidentId: string | null;
  type: "monitor_down" | "monitor_recovered" | "ssl_expiring" | "test";
}

export async function sendIncidentAlerts(data: AlertJobData): Promise<void> {
  const monitor = await Monitor.findById(data.monitorId);
  if (!monitor) return;

  const incident = data.incidentId
    ? await Incident.findById(data.incidentId)
    : null;

  const channelIds = monitor.alertChannelIds || [];
  const channels = await AlertChannel.find({
    _id: { $in: channelIds },
    organizationId: data.organizationId,
    isEnabled: true,
  }).select("+configEncrypted");

  // Also send to org default email channels if none attached
  let targets = channels;
  if (!targets.length) {
    targets = await AlertChannel.find({
      organizationId: data.organizationId,
      type: "email",
      isEnabled: true,
    }).select("+configEncrypted");
  }

  const subject =
    data.type === "monitor_down"
      ? `[DOWN] ${monitor.name} is unreachable`
      : data.type === "monitor_recovered"
        ? `[RECOVERED] ${monitor.name} is back up`
        : `[ALERT] ${monitor.name}`;

  const body = [
    `${appConfig.name} Alert`,
    "",
    `Monitor: ${monitor.name}`,
    `URL: ${monitor.url}`,
    `Event: ${data.type}`,
    incident ? `Incident #${incident.incidentNumber}` : "",
    incident ? `Reason: ${incident.failureReason}` : "",
    `Time: ${new Date().toISOString()}`,
    "",
    `Dashboard: ${appConfig.url}/dashboard/monitors/${monitor._id}`,
  ]
    .filter(Boolean)
    .join("\n");

  for (const channel of targets) {
    const dedupeKey = `${data.type}:${data.incidentId || monitor._id}:${channel._id}:${data.type === "monitor_recovered" ? "recovery" : "down"}`;

    try {
      // Deduplicate — unique index will reject duplicates
      await NotificationDelivery.create({
        organizationId: data.organizationId,
        alertChannelId: channel._id,
        monitorId: monitor._id,
        incidentId: data.incidentId,
        eventType: data.type === "test" ? "test" : data.type,
        status: "pending",
        dedupeKey,
        payloadSummary: subject,
      });
    } catch {
      // Duplicate delivery — skip
      continue;
    }

    try {
      const config = JSON.parse(decryptSecret(channel.configEncrypted as string));

      if (channel.type === "email") {
        const configured = await sendEmail({
          to: config.email,
          subject,
          text: body,
        });
        if (!configured) {
          await NotificationDelivery.updateOne(
            { dedupeKey },
            {
              status: "skipped",
              lastError:
                "Email provider not configured (set RESEND_API_KEY or SMTP credentials)",
            }
          );
          continue;
        }
      } else if (channel.type === "slack") {
        await sendSlackWebhook(config.webhookUrl, subject, body);
      } else if (channel.type === "discord") {
        await sendDiscordWebhook(config.webhookUrl, subject, body);
      } else if (channel.type === "webhook") {
        await sendSignedWebhook(config.url, config.secret, {
          type: data.type,
          monitor: {
            id: String(monitor._id),
            name: monitor.name,
            url: monitor.url,
            status: monitor.status,
          },
          incident: incident
            ? {
                id: String(incident._id),
                number: incident.incidentNumber,
                reason: incident.failureReason,
              }
            : null,
          timestamp: new Date().toISOString(),
        });
      } else if (channel.type === "sms") {
        await NotificationDelivery.updateOne(
          { dedupeKey },
          {
            status: "skipped",
            lastError:
              "SMS requires Twilio configuration (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER)",
          }
        );
        continue;
      }

      await NotificationDelivery.updateOne(
        { dedupeKey },
        { status: "sent", sentAt: new Date(), attempts: 1 }
      );

      if (incident && data.type === "monitor_down") {
        incident.alertSentAt = new Date();
        await incident.save();
      }
      if (incident && data.type === "monitor_recovered") {
        incident.recoveryAlertSentAt = new Date();
        await incident.save();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Delivery failed";
      await NotificationDelivery.updateOne(
        { dedupeKey },
        { status: "failed", lastError: message, attempts: 1 }
      );
    }
  }
}
