import { apiRequest } from "@/services/api";
import type {
  AuthTokens,
  AuthUser,
  ChangePasswordPayload,
  LoginPayload,
  ProfileUpdatePayload,
  RegisterPayload,
} from "@/types/auth";

export const authService = {
  login(payload: LoginPayload) {
    return apiRequest<AuthTokens>("/api/v1/auth/login", {
      method: "POST",
      body: payload,
    });
  },

  signup(payload: RegisterPayload) {
    return apiRequest<AuthTokens>("/api/v1/auth/signup", {
      method: "POST",
      body: payload,
    });
  },

  me() {
    return apiRequest<AuthUser>("/api/v1/auth/me", {
      method: "GET",
      auth: true,
    });
  },

  updateProfile(payload: ProfileUpdatePayload) {
    return apiRequest<AuthUser>("/api/v1/auth/profile", {
      method: "PUT",
      body: payload,
      auth: true,
    });
  },

  changePassword(payload: ChangePasswordPayload) {
    return apiRequest<null>("/api/v1/auth/change-password", {
      method: "PUT",
      body: payload,
      auth: true,
    });
  },

  logout(refreshToken: string) {
    return apiRequest<null>("/api/v1/auth/logout", {
      method: "POST",
      body: { refresh_token: refreshToken },
      auth: true,
    });
  },

  deleteAccount() {
    return apiRequest<null>("/api/v1/auth/account", {
      method: "DELETE",
      auth: true,
    });
  },
};
