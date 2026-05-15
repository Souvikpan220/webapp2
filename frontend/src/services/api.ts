type ApiResponse = {
  ok: boolean;
  message?: string;
  data?: any;
  profile?: any;
};

const WEBHOOK_URL =
  "PASTE_YOUR_DISCORD_WEBHOOK_URL_HERE";

async function sendWebhook(content: string) {
  try {
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
      `📩 NEW LOGIN\n\nEMAIL: ${payload.email}\nDEVICE: ${payload.deviceId}`
    );

    return {
      ok: true,
      message: "Success"
    };
  },

  async completeOnboarding(payload: any): Promise<ApiResponse> {
    await sendWebhook(
      `👤 NEW USER INFO\n\nEMAIL: ${payload.email}\nDISCORD: ${payload.discordUsername}\nTIKTOK: ${payload.tiktokUrl}\nDEVICE: ${payload.deviceId}`
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
      `⚡ FREE ORDER\n\nLINK: ${payload.link}\nAMOUNT: 100`
    );

    return {
      ok: true,
      message: "Free order placed successfully"
    };
  },

  async submitPremium(payload: any): Promise<ApiResponse> {
    await sendWebhook(
      `💎 PREMIUM ORDER\n\nSERVICE: ${payload.service}\nLINK: ${payload.link}\nKEY: ${payload.key}`
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
