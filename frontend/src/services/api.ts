import { tokenStore } from "@/lib/token-store";
import type { ApiResponse, AuthTokens } from "@/types/auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
  retry?: boolean;
};

function extractErrorMessage(payload: unknown, status: number): string {
  if (!payload || typeof payload !== "object") {
    return `Request failed (${status})`;
  }
  const body = payload as {
    message?: string;
    detail?: string | Array<{ msg?: string }>;
  };
  if (typeof body.message === "string" && body.message) return body.message;
  if (typeof body.detail === "string" && body.detail) return body.detail;
  if (Array.isArray(body.detail) && body.detail.length > 0) {
    return body.detail.map((d) => d.msg || "Validation error").join(", ");
  }
  return `Request failed (${status})`;
}

async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
  let payload: ApiResponse<T> | null = null;
  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new ApiError(extractErrorMessage(payload, response.status), response.status);
  }

  if (!payload) {
    throw new ApiError("Invalid server response", response.status);
  }

  return payload;
}

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = tokenStore.getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    const payload = await parseResponse<AuthTokens>(response);
    if (!payload.data) return false;
    tokenStore.setSession(
      payload.data.access_token,
      payload.data.refresh_token,
      payload.data.user,
    );
    return true;
  } catch {
    tokenStore.clear();
    return false;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const { body, auth = false, retry = true, headers, ...rest } = options;
  const requestHeaders = new Headers(headers);
  requestHeaders.set("Accept", "application/json");

  if (body !== undefined) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (auth) {
    const accessToken = tokenStore.getAccessToken();
    if (accessToken) {
      requestHeaders.set("Authorization", `Bearer ${accessToken}`);
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 && auth && retry) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return apiRequest<T>(path, { ...options, retry: false });
    }
  }

  return parseResponse<T>(response);
}

export { API_URL };
