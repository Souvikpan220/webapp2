import { readJson, writeJson } from "../database/jsonStore.js";
import { istDayKey, minutesAgo } from "../utils/time.js";

export async function assertFreeAllowed({ ip, deviceId }) {
  const store = await readJson("cooldowns.json", { free: [], premium: [] });
  const today = istDayKey();
  const matchingToday = store.free.filter((row) => row.dayKey === today && (row.ip === ip || row.deviceId === deviceId));
  const latest = matchingToday.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))[0];
  if (latest && Date.parse(latest.createdAt) > minutesAgo(60)) {
    const next = new Date(Date.parse(latest.createdAt) + 60 * 60_000).toISOString();
    const error = new Error(`Free cooldown active until ${next}.`);
    error.status = 429;
    throw error;
  }
  if (matchingToday.length >= 5) {
    const error = new Error("Daily free order limit reached. Reset is at 12AM IST.");
    error.status = 429;
    throw error;
  }
}

export async function assertPremiumAllowed({ ip, deviceId }) {
  const store = await readJson("cooldowns.json", { free: [], premium: [] });
  const latest = store.premium
    .filter((row) => row.ip === ip || row.deviceId === deviceId)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))[0];
  if (latest && Date.parse(latest.createdAt) > minutesAgo(5)) {
    const error = new Error("Premium cooldown active. Please wait 5 minutes between premium orders.");
    error.status = 429;
    throw error;
  }
}

export async function recordCooldown(type, data) {
  const store = await readJson("cooldowns.json", { free: [], premium: [] });
  const row = { ...data, dayKey: istDayKey(), createdAt: new Date().toISOString() };
  store[type].push(row);
  store.free = store.free.filter((item) => item.dayKey === istDayKey());
  store.premium = store.premium.slice(-1000);
  await writeJson("cooldowns.json", store);
}
