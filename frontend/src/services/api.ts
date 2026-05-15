type ApiResponse = {
  ok: boolean;
  message?: string;
  data?: any;
  profile?: any;
};

export const api = {
  async logEmail(payload: any): Promise<ApiResponse> {
    console.log("EMAIL:", payload);

    return {
      ok: true,
      message: "Success"
    };
  },

  async completeOnboarding(payload: any): Promise<ApiResponse> {
    console.log("ONBOARDING:", payload);

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
    console.log("FREE ORDER:", payload);

    return {
      ok: true,
      message: "Free order placed successfully"
    };
  },

  async submitPremium(payload: any): Promise<ApiResponse> {
    console.log("PREMIUM ORDER:", payload);

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
