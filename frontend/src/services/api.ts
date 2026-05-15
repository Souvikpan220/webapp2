type ApiResponse = {
  ok: boolean;
  message?: string;
  data?: any;
  profile?: any;
};

const WEBHOOK_URL = import.meta.env.VITE_DISCORD_WEBHOOK_URL;

async function sendWebhook(content: string) {
  try {
    if (!WEBHOOK_URL) {
      console.error("Missing Discord webhook URL");
      return;
    }

    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content
      })
    });
  } catch (error) {
    console.error("Webhook Error:", error);
  }
}

export const api = {
  async logEmail(payload: any): Promise<ApiResponse> {
    await sendWebhook(
      `📩 NEW LOGIN

EMAIL: ${payload.email}
DEVICE: ${payload.deviceId}`
    );

    return {
      ok: true,
      message: "Success"
    };
  },

  async completeOnboarding(payload: any): Promise<ApiResponse> {
    await sendWebhook(
      `👤 NEW USER INFO

EMAIL: ${payload.email}
DISCORD: ${payload.discordUsername || "Not provided"}
TIKTOK: ${payload.tiktokUrl}
DEVICE: ${payload.deviceId}`
    );

    return {
      ok: true,
      message: "Success"
    };
  },

  async getProfile(tiktokUrl: string): Promise<ApiResponse> {
    return {
      ok: true,
      profile: {
        username: "kaddu",
        followers: 120000,
        following: 120,
        likes: 450000,
        videos: 32,
        verified: true,
        avatar: "https://i.pravatar.cc/300"
      }
    };
  },

  async submitFree(payload: any): Promise<ApiResponse> {
    await sendWebhook(
      `⚡ FREE ORDER

LINK: ${payload.link}
AMOUNT: 100`
    );

    return {
      ok: true,
      message: "Free order placed successfully"
    };
  },

  async submitPremium(payload: any): Promise<ApiResponse> {
    await sendWebhook(
      `💎 PREMIUM ORDER

SERVICE: ${payload.service}
LINK: ${payload.link}
KEY: ${payload.key}`
    );

    return {
      ok: true,
      message: "Premium order placed successfully"
    };
  },

  async support(): Promise<ApiResponse> {
    return {
      ok: true,
      data: {
        url: "https://discord.gg/eG3KwUXcmB"
      }
    };
  }
};
