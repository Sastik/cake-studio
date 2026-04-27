export const API_BASE = "/api";

export type ApiError = {
  status: number;
  message: string;
};

async function parseError(res: Response): Promise<ApiError> {
  const status = res.status;
  try {
    const data = (await res.json()) as { detail?: string };
    return { status, message: data.detail ?? "Request failed" };
  } catch {
    return { status, message: "Request failed" };
  }
}

export async function apiJson<T>(
  path: string,
  init?: RequestInit & { token?: string },
): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  if (init?.token) headers.set("Authorization", `Bearer ${init.token}`);

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });
  if (!res.ok) throw await parseError(res);
  return (await res.json()) as T;
}

