import crypto from "crypto";
import { readJson, writeJson } from "../database/jsonStore.js";

export async function sendWebhook(event, payload) {
  try {
    const entry = { id: crypto.randomUUID(), event, payload, createdAt: new Date().toISOString() };
    const log = await readJson("webhook-log.json", []);
    log.unshift(entry);
    await writeJson("webhook-log.json", log.slice(0, 500));

    if (!process.env.DISCORD_WEBHOOK_URL) {
      console.info("[webhook] skipped, DISCORD_WEBHOOK_URL not configured", event);
      return { delivered: false, stored: true, skipped: true };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        username: "Kaddu Boost",
        embeds: [
          {
            title: event,
            color: 0x27f5ff,
            timestamp: entry.createdAt,
            fields: Object.entries(payload).slice(0, 12).map(([name, value]) => ({ name, value: String(value || "n/a"), inline: true }))
          }
        ]
      })
    });
    clearTimeout(timeout);
    console.info("[webhook] response", event, res.status, res.ok);
    return { delivered: res.ok, stored: true, status: res.status };
  } catch (error) {
    console.error("[webhook] failed without blocking flow", event, error?.message || error);
    return { delivered: false, stored: false, error: error?.message || "Webhook failed" };
  }
}
