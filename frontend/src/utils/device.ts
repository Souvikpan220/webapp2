const DEVICE_KEY = "kaddu_device_id";

export function getDeviceId() {
  const existing = localStorage.getItem(DEVICE_KEY);
  if (existing) return existing;

  const raw = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    crypto.randomUUID()
  ].join("|");
  const deviceId = btoa(unescape(encodeURIComponent(raw))).replace(/[^a-zA-Z0-9]/g, "").slice(0, 64);
  localStorage.setItem(DEVICE_KEY, deviceId);
  return deviceId;
}
