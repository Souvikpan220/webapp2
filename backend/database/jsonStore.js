import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverDataDir = path.resolve(__dirname);
export const dataDir = process.env.DATA_DIR || (process.env.VERCEL ? path.join(os.tmpdir(), "kaddu-data") : serverDataDir);
export const keyDir = process.env.VERCEL ? path.join(dataDir, "keys") : path.resolve(__dirname, "../keys");
const cooldownDir = process.env.VERCEL ? dataDir : path.resolve(__dirname, "../cooldowns");
const logDir = process.env.VERCEL ? dataDir : path.resolve(__dirname, "../logs");

const defaults = {
  "users.json": [],
  "orders.json": []
};

export async function ensureStorage() {
  await fs.mkdir(keyDir, { recursive: true });
  await fs.mkdir(cooldownDir, { recursive: true });
  await fs.mkdir(logDir, { recursive: true });
  console.info("[storage] data directory", dataDir);
  await Promise.all(Object.entries(defaults).map(([file, value]) => ensureJson(path.join(dataDir, file), value)));
  await ensureJson(path.join(cooldownDir, "cooldowns.json"), { free: [], premium: [] });
  await ensureJson(path.join(logDir, "webhook-log.json"), []);
  await ensureJson(path.join(keyDir, "kaddu1.json"), [
    { id: "k1-demo", hash: "b9246495c1a00ca7b88150bcc60335c3805609362e72df2e5ee1b3ca56df89b3", expiresAt: "2027-12-31T18:29:59.000Z", usedAt: null }
  ]);
  await ensureJson(path.join(keyDir, "kaddu2.json"), [
    { id: "k2-demo", hash: "a796e98796f224bdcbe7c989af2fa28df5995110154a7e9fb1d2f4e3c786e828", expiresAt: "2027-12-31T18:29:59.000Z", usedAt: null }
  ]);
  await ensureJson(path.join(keyDir, "kaddu3.json"), [
    { id: "k3-demo", hash: "d9b4e3546370212c4c919cdd124e479b6321a09dac7a0e11bf5147c9aa6a6f3c", expiresAt: "2027-12-31T18:29:59.000Z", usedAt: null }
  ]);
}

async function ensureJson(file, value) {
  try {
    await fs.access(file);
  } catch {
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(value, null, 2));
  }
}

export async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(resolveDataFile(file), "utf8"));
  } catch {
    return fallback;
  }
}

export async function writeJson(file, data) {
  await fs.writeFile(resolveDataFile(file), JSON.stringify(data, null, 2));
}

export async function readKeyFile(file) {
  return JSON.parse(await fs.readFile(path.join(keyDir, file), "utf8"));
}

export async function writeKeyFile(file, data) {
  await fs.writeFile(path.join(keyDir, file), JSON.stringify(data, null, 2));
}

function resolveDataFile(file) {
  if (file === "cooldowns.json") return path.join(cooldownDir, file);
  if (file === "webhook-log.json") return path.join(logDir, file);
  return path.join(dataDir, file);
}
