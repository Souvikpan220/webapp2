import crypto from "crypto";
import { premiumServices } from "../config/services.js";
import { readKeyFile, writeKeyFile } from "../database/jsonStore.js";

export async function validatePremiumKey(service, rawKey) {
  const config = premiumServices[service];
  if (!config) {
    const error = new Error("Unknown premium service.");
    error.status = 400;
    throw error;
  }
  const hash = crypto.createHash("sha256").update(rawKey.trim()).digest("hex");
  const keys = await readKeyFile(config.keyFile);
  const index = keys.findIndex((key) => key.hash === hash);
  if (index < 0) return reject("Invalid premium key.");
  if (keys[index].usedAt) return reject("This premium key was already used.");
  if (keys[index].expiresAt && Date.parse(keys[index].expiresAt) < Date.now()) return reject("This premium key has expired.");

  return { id: keys[index].id, hash, keyFile: config.keyFile };
}

export async function markKeyUsed(keyFile, hash) {
  const keys = await readKeyFile(keyFile);
  const index = keys.findIndex((key) => key.hash === hash);
  if (index < 0 || keys[index].usedAt) return;
  keys[index] = { ...keys[index], usedAt: new Date().toISOString() };
  await writeKeyFile(keyFile, keys);
}

function reject(message) {
  const error = new Error(message);
  error.status = 403;
  throw error;
}
