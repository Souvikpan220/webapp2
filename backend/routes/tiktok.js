import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import { fetchTikTokProfile } from "../services/tiktok.js";

const router = Router();
const schema = z.object({
  url: z.string().url().regex(/^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+\/?$/i, "Invalid TikTok profile URL.")
});

router.get("/profile", validate(schema), async (req, res, next) => {
  try {
    const profile = await fetchTikTokProfile(req.validated.url);
    res.json({ ok: true, data: profile });
  } catch (error) {
    next(error);
  }
});

export default router;
