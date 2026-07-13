import type { ApiResponse } from "@/types/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function buildUrl(path: string, params?: object): string {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    Object.entries(params as Record<string, unknown>).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

async function handleResponse<T>(response: Response): Promise<T> {
  const json = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !json.success) {
    throw new ApiError(
      json.message || `Request failed with status ${response.status}`,
      response.status
    );
  }

  return json.data;
}

export async function apiGet<T>(path: string, params?: object): Promise<T> {
  const response = await fetch(buildUrl(path, params), {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  return handleResponse<T>(response);
}

export async function apiPost<T, B = unknown>(
  path: string,
  body: B
): Promise<T> {
  const response = await fetch(buildUrl(path), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(response);
}

export async function apiPut<T, B = unknown>(
  path: string,
  body: B
): Promise<T> {
  const response = await fetch(buildUrl(path), {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(response);
}

export async function apiDelete<T>(path: string): Promise<T> {
  const response = await fetch(buildUrl(path), {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });
  return handleResponse<T>(response);
}
