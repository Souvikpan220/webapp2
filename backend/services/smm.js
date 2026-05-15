import { nanoid } from "nanoid";

export async function placeSmmOrder({ serviceId, link, quantity }) {
  if (!process.env.SMM_API_KEY || !process.env.SMM_API_URL || process.env.SMM_API_URL.includes("example-smm-panel.com")) {
    console.info("[smm] mock order", { serviceId, quantity });
    return {
      orderId: `mock_${nanoid(10)}`,
      provider: "mock",
      serviceId,
      link,
      quantity
    };
  }

  const body = new URLSearchParams({
    key: process.env.SMM_API_KEY,
    action: "add",
    service: serviceId,
    link,
    quantity: String(quantity)
  });
  let res;
  let data;
  try {
    res = await fetch(process.env.SMM_API_URL, { method: "POST", body });
    data = await res.json().catch(() => ({}));
    console.info("[smm] response", res.status, data?.order || data?.error || "no-body");
  } catch (error) {
    console.error("[smm] network error", error?.message || error);
    const err = new Error("SMM panel is temporarily unavailable.");
    err.status = 502;
    throw err;
  }
  if (!res.ok || data.error) {
    const error = new Error(data.error || "SMM panel rejected the order.");
    error.status = 502;
    throw error;
  }
  return { orderId: String(data.order), provider: "smm", serviceId, link, quantity };
}
