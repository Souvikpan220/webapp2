import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import { readJson, writeJson } from "../database/jsonStore.js";
import { sendWebhook } from "../services/webhook.js";
import { requester } from "../utils/client.js";

const router = Router();
const emailSchema = z.object({
  email: z.string().email(),
  deviceId: z.string().min(16).max(128)
});
const onboardSchema = emailSchema.extend({
  discordUsername: z.string().max(80).optional().default(""),
  tiktokUrl: z.string().url().regex(/^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+\/?$/i, "Invalid TikTok profile URL.")
});

router.post("/email", validate(emailSchema), async (req, res, next) => {
  try {
    const data = req.validated;
    const meta = requester(req, data.deviceId);
    await upsertUser({ ...data, ...meta, stage: "email" });
    await sendWebhook("Email Sign In", { email: data.email, deviceId: data.deviceId, ip: meta.ip });
    res.json({ ok: true, data: { saved: true } });
  } catch (error) {
    next(error);
  }
});

async function saveProfile(req, res, next) {
  try {
    const data = req.validated;
    const meta = requester(req, data.deviceId);
    await upsertUser({ ...data, ...meta, stage: "complete" });
    await sendWebhook("Onboarding Complete", { email: data.email, discordUsername: data.discordUsername, tiktokUrl: data.tiktokUrl, deviceId: data.deviceId, ip: meta.ip });
    res.json({ ok: true, data: { saved: true } });
  } catch (error) {
    next(error);
  }
}

router.post("/profile", validate(onboardSchema), saveProfile);
router.post("/onboarding", validate(onboardSchema), saveProfile);

async function upsertUser(user) {
  const users = await readJson("users.json", []);
  const index = users.findIndex((row) => row.email === user.email || row.deviceId === user.deviceId);
  const next = { ...(index >= 0 ? users[index] : {}), ...user, updatedAt: new Date().toISOString(), createdAt: index >= 0 ? users[index].createdAt : new Date().toISOString() };
  if (index >= 0) users[index] = next;
  else users.push(next);
  await writeJson("users.json", users);
}

export default router;
