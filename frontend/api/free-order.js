const orderStore = new Map();

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        ok: false,
        message: "Method not allowed"
      });
    }

    const forwarded = req.headers["x-forwarded-for"];
    const ip =
      typeof forwarded === "string"
        ? forwarded.split(",")[0]
        : "unknown";

    const now = Date.now();

    const ONE_HOUR = 60 * 60 * 1000;

    const today = new Date().toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata"
    });

    if (!orderStore.has(ip)) {
      orderStore.set(ip, {
        lastOrder: 0,
        count: 0,
        day: today
      });
    }

    const userData = orderStore.get(ip);

    if (userData.day !== today) {
      userData.count = 0;
      userData.day = today;
    }

    if (userData.count >= 5) {
      return res.status(429).json({
        ok: false,
        message: "Daily free limit reached"
      });
    }

    if (now - userData.lastOrder < ONE_HOUR) {
      const remaining =
        ONE_HOUR - (now - userData.lastOrder);

      const minutes = Math.ceil(
        remaining / (60 * 1000)
      );

      return res.status(429).json({
        ok: false,
        message: `Wait ${minutes} minutes before next free order`
      });
    }

    const { link } = req.body;

    if (!link) {
      return res.status(400).json({
        ok: false,
        message: "Missing TikTok link"
      });
    }

    const response = await fetch(
      "https://cheapestsmmpanels.com/api/v2",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          key: process.env.SMM_API_KEY,
          action: "add",
          service: "3080",
          link: link,
          quantity: "100"
        })
      }
    );

    const text = await response.text();

    console.log("PANEL RESPONSE:", text);

    userData.lastOrder = now;
    userData.count += 1;

    orderStore.set(ip, userData);

    return res.status(200).json({
      ok: true,
      panel: text
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      message: "Server error"
    });
  }
}
