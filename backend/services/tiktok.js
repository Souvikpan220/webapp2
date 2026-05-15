const fallbackAvatar = "https://api.dicebear.com/9.x/glass/svg?seed=kaddu-profile";

export async function fetchTikTokProfile(profileUrl) {
  const username = profileUrl.split("@")[1]?.replaceAll("/", "") || "creator";
  if (!process.env.RAPIDAPI_KEY) {
    console.info("[tiktok] RAPIDAPI_KEY missing, using mock profile", username);
    return mockProfile(username);
  }

  const url = new URL(process.env.RAPIDAPI_TIKTOK_PROFILE_URL || "https://tiktok-scraper7.p.rapidapi.com/user/info");
  url.searchParams.set("unique_id", username);
  let data;
  try {
    const res = await fetch(url, {
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": process.env.RAPIDAPI_HOST || process.env.RAPIDAPI_TIKTOK_HOST || "tiktok-scraper7.p.rapidapi.com"
      }
    });
    console.info("[tiktok] profile response", res.status, res.ok);
    if (!res.ok) return mockProfile(username);
    data = await res.json().catch(() => null);
  } catch (error) {
    console.error("[tiktok] network error, using mock profile", error?.message || error);
    return mockProfile(username);
  }
  const user = data?.data?.user || data?.user || {};
  const stats = data?.data?.stats || data?.stats || {};
  return {
    username: user.uniqueId || username,
    avatar: user.avatarLarger || user.avatarMedium || fallbackAvatar,
    followers: Number(stats.followerCount || 0),
    following: Number(stats.followingCount || 0),
    likes: Number(stats.heartCount || 0),
    videos: Number(stats.videoCount || 0),
    verified: Boolean(user.verified)
  };
}

function mockProfile(username) {
  return {
    username,
    avatar: `${fallbackAvatar}-${encodeURIComponent(username)}`,
    followers: 38420,
    following: 318,
    likes: 928400,
    videos: 114,
    verified: username.toLowerCase().includes("official")
  };
}
