import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Profile } from "../types";

const fallbackAvatar = "https://api.dicebear.com/9.x/glass/svg?seed=kaddu-neon";

export function useProfile(tiktokUrl?: string) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(Boolean(tiktokUrl));

  useEffect(() => {
    let active = true;
    if (!tiktokUrl) return;
    setLoading(true);
    api.getProfile(tiktokUrl).then((res) => {
      if (!active) return;
      if (!res.ok) console.warn("[profile] using fallback profile", res.message);
      setProfile(
        res.data || {
          username: tiktokUrl.split("@")[1]?.replace("/", "") || "creator",
          avatar: fallbackAvatar,
          followers: 12840,
          following: 422,
          likes: 583200,
          videos: 76,
          verified: false
        }
      );
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [tiktokUrl]);

  return { profile, loading };
}
