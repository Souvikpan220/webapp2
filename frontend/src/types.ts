export type AuthState = {
  email: string;
  discordUsername?: string;
  tiktokUrl?: string;
  deviceId: string;
};

export type Profile = {
  username: string;
  avatar: string;
  followers: number;
  following: number;
  likes: number;
  videos: number;
  verified: boolean;
};

export type ServiceType = "kaddu1" | "kaddu2" | "kaddu3";

export type ApiResult<T> = {
  ok: boolean;
  data?: T;
  message?: string;
};
