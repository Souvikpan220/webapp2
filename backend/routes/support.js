import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ ok: true, data: { url: process.env.DISCORD_SUPPORT_URL || "https://discord.gg/your-server" } });
});

export default router;
