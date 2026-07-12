/**
 * Client-side API helper. Calls our API routes and handles the response envelope.
 */

export interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

async function request<T>(
  url: string,
  options?: RequestInit,
  isRetry = false,
): Promise<ApiResponse<T>> {
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    const isAuthRoute = url.startsWith("/api/auth/");
    if (res.status === 401 && !isRetry && !isAuthRoute) {
      const refreshed = await refreshAccessToken();
      if (refreshed) return request<T>(url, options, true);
    }
    throw new Error(
      json.error?.message || `Request failed with status ${res.status}`,
    );
  }

  return json as ApiResponse<T>;
}

export const api = {
  get: <T>(url: string) => request<T>(url),

  post: <T>(url: string, body?: unknown) =>
    request<T>(url, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(url: string, body?: unknown) =>
    request<T>(url, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),
};

let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}
