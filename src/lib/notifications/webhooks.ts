import { createHmac } from "crypto";

export async function sendSlackWebhook(
  webhookUrl: string,
  title: string,
  text: string
): Promise<void> {
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: `*${title}*\n${text}`,
    }),
  });
  if (!res.ok) {
    throw new Error(`Slack webhook failed: HTTP ${res.status}`);
  }
}

export async function sendDiscordWebhook(
  webhookUrl: string,
  title: string,
  text: string
): Promise<void> {
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: `**${title}**\n\`\`\`\n${text}\n\`\`\``,
    }),
  });
  if (!res.ok) {
    throw new Error(`Discord webhook failed: HTTP ${res.status}`);
  }
}

export async function sendSignedWebhook(
  url: string,
  secret: string,
  payload: unknown
): Promise<void> {
  const body = JSON.stringify(payload);
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = createHmac("sha256", secret)
    .update(`${timestamp}.${body}`)
    .digest("hex");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-AROLAGB-Timestamp": timestamp,
      "X-AROLAGB-Signature": `sha256=${signature}`,
      "User-Agent": "AROLAGB-Uptime-Webhook/1.0",
    },
    body,
  });

  if (!res.ok) {
    throw new Error(`Webhook delivery failed: HTTP ${res.status}`);
  }
}
