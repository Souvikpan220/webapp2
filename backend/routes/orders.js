import { Router } from "express";
import { z } from "zod";
import { nanoid } from "nanoid";
import { premiumServices, freeService } from "../config/services.js";
import { validate } from "../middleware/validate.js";
import { requester } from "../utils/client.js";
import { assertFreeAllowed, assertPremiumAllowed, recordCooldown } from "../services/cooldowns.js";
import { markKeyUsed, validatePremiumKey } from "../services/keys.js";
import { placeSmmOrder } from "../services/smm.js";
import { sendWebhook } from "../services/webhook.js";
import { readJson, writeJson } from "../database/jsonStore.js";

const router = Router();
const videoUrl = z.string().url().regex(/^https?:\/\/(www\.|vm\.|vt\.)?tiktok\.com\/.+/i, "Invalid TikTok video URL.");
const baseOrder = z.object({
  email: z.string().email(),
  videoUrl,
  deviceId: z.string().min(16).max(128)
});
const premiumOrder = baseOrder.extend({
  service: z.enum(["kaddu1", "kaddu2", "kaddu3"]),
  premiumKey: z.string().min(8).max(120)
});

router.post("/free", validate(baseOrder), async (req, res, next) => {
  try {
    const data = req.validated;
    const meta = requester(req, data.deviceId);
    await assertFreeAllowed(meta);
    const order = await placeSmmOrder({ serviceId: freeService.serviceId, link: data.videoUrl, quantity: freeService.amount });
    await recordOrder({ type: "free", email: data.email, ...meta, videoUrl: data.videoUrl, amount: freeService.amount, serviceId: freeService.serviceId, providerOrderId: order.orderId });
    await recordCooldown("free", { ...meta, email: data.email });
    await sendWebhook("Free Order", { email: data.email, videoUrl: data.videoUrl, amount: freeService.amount, orderId: order.orderId, ip: meta.ip, deviceId: meta.deviceId });
    res.json({ ok: true, data: { orderId: order.orderId, nextAllowedAt: new Date(Date.now() + 60 * 60_000).toISOString() } });
  } catch (error) {
    next(error);
  }
});

router.post("/premium", validate(premiumOrder), async (req, res, next) => {
  try {
    const data = req.validated;
    const meta = requester(req, data.deviceId);
    const service = premiumServices[data.service];
    await assertPremiumAllowed(meta);
    const key = await validatePremiumKey(data.service, data.premiumKey);
    const order = await placeSmmOrder({ serviceId: service.serviceId, link: data.videoUrl, quantity: service.amount });
    await markKeyUsed(key.keyFile, key.hash);
    await recordOrder({ type: "premium", premiumService: data.service, keyId: key.id, email: data.email, ...meta, videoUrl: data.videoUrl, amount: service.amount, serviceId: service.serviceId, providerOrderId: order.orderId });
    await recordCooldown("premium", { ...meta, email: data.email });
    await sendWebhook("Premium Order", { email: data.email, service: data.service, amount: service.amount, orderId: order.orderId, keyId: key.id, ip: meta.ip, deviceId: meta.deviceId });
    res.json({ ok: true, data: { orderId: order.orderId } });
  } catch (error) {
    next(error);
  }
});

async function recordOrder(order) {
  const orders = await readJson("orders.json", []);
  orders.unshift({ id: nanoid(12), ...order, createdAt: new Date().toISOString() });
  await writeJson("orders.json", orders.slice(0, 2000));
}

export default router;
