type ApiResponse = {
  ok: boolean;
  message?: string;
  data?: any;
  profile?: any;
};

const API_BASE = "/api";

async function request(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE}${url}`, {
      headers: {
        "Content-Type": "application/json"
      },
      ...options
    });

    const data = await response.json();

    return data as ApiResponse;
  } catch (error) {
    console.error(error);

    return {
      ok: false,
      message: "Network error"
    };
  }
}

export const api = {
  async logEmail(payload: any): Promise<ApiResponse> {
    return await request("/auth/email", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  async completeOnboarding(payload: any): Promise<ApiResponse> {
    return await request("/auth/profile", {
      method: "POST",
      body: JSON.stringify(payload)
    });
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
    return {
      ok: true,
      message: "Free order placed successfully"
    };
  },

  async submitPremium(payload: any): Promise<ApiResponse> {
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
