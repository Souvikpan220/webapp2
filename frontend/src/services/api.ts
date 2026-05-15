const API_BASE = "/api";

async function request(url, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${url}`, {
      headers: {
        "Content-Type": "application/json"
      },
      ...options
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);

    return {
      ok: false,
      message: "Network error"
    };
  }
}

export const api = {
  async logEmail(payload) {
    return request("/auth/email", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  async completeOnboarding(payload) {
    return request("/auth/profile", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  async support() {
    return {
      ok: true,
      data: {
        url: "https://discord.gg/eG3KwUXcmB"
      }
    };
  }
};
