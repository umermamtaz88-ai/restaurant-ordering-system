import type { AuthUser } from "@/types/auth";

const ACCESS_KEY = "solenne_access_token";
const REFRESH_KEY = "solenne_refresh_token";
const USER_KEY = "solenne_auth_user";

function storage(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

export const tokenStore = {
  getAccessToken(): string | null {
    return storage()?.getItem(ACCESS_KEY) ?? null;
  },
  getRefreshToken(): string | null {
    return storage()?.getItem(REFRESH_KEY) ?? null;
  },
  getUser(): AuthUser | null {
    const raw = storage()?.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },
  setSession(accessToken: string, refreshToken: string, user: AuthUser) {
    const s = storage();
    if (!s) return;
    s.setItem(ACCESS_KEY, accessToken);
    s.setItem(REFRESH_KEY, refreshToken);
    s.setItem(USER_KEY, JSON.stringify(user));
  },
  clear() {
    const s = storage();
    if (!s) return;
    s.removeItem(ACCESS_KEY);
    s.removeItem(REFRESH_KEY);
    s.removeItem(USER_KEY);
  },
};
