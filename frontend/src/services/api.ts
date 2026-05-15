type ApiResponse = {
  ok: boolean;
  message?: string;
  data?: any;
  profile?: any;
};

const WEBHOOK_URL =
  import.meta.env.VITE_DISCORD_WEBHOOK_URL || "";

async function sendWebhook(content: string): Promise<void> {
  try {
    if (!WEBHOOK_URL) {
      console.error("Webhook URL missing");
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
  try {
    const username = tiktokUrl
      .split("@")[1]
      ?.split("/")[0]
      ?.trim();

    if (!username) {
      return {
        ok: false,
        message: "Invalid TikTok URL"
      };
    }

    const response = await fetch(
      `https://${import.meta.env.VITE_RAPIDAPI_HOST}/user/info?unique_id=${username}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
          "x-rapidapi-host": import.meta.env.VITE_RAPIDAPI_HOST
        }
      }
    );

    const data = await response.json();

    console.log(data);

    const user = data?.data?.user;
    const stats = data?.data?.stats;

    if (!user) {
      return {
        ok: false,
        message: "User not found"
      };
    }

    return {
      ok: true,
      profile: {
        username: user.unique_id || username,
        followers: stats?.follower_count || 0,
        following: stats?.following_count || 0,
        likes: stats?.heart_count || 0,
        videos: stats?.video_count || 0,
        verified: user?.is_verified || false,
        avatar:
          user?.avatar ||
          "https://i.pravatar.cc/300"
      }
    };
  } catch (error) {
    console.error(error);

    return {
      ok: false,
      message: "Failed to fetch TikTok profile"
    };
  }
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
