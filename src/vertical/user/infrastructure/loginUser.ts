export interface LoginResponse {
  token?: string;
  user?: unknown;
  [key: string]: unknown;
}

const LOGIN_ENDPOINT = "/api/auth/login";
const AUTH_TOKEN_STORAGE_KEY = "banca-nova-auth-token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function clearAuthToken(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

function storeToken(token: string | null | undefined): void {
  if (typeof window === "undefined") return;

  if (!token) {
    clearAuthToken();
    return;
  }

  const normalizedToken = token.startsWith("Bearer ") ? token.slice(7) : token;
  sessionStorage.setItem(AUTH_TOKEN_STORAGE_KEY, normalizedToken);
}

export function getAuthHeader(): Record<string, string> {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(LOGIN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const responseText = await response.text();
    let message = responseText;

    try {
      const errorBody = JSON.parse(responseText) as { message?: string; error?: string };
      message = errorBody.message ?? errorBody.error ?? responseText;
    } catch {
      // Manté el text original quan l'API no respon amb JSON.
    }

    throw new Error(message || `Unable to sign in (${response.status}).`);
  }

  const authorizationHeader = response.headers.get("authorization");
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    storeToken(authorizationHeader);
    return {};
  }

  const payload = (await response.json()) as LoginResponse;
  const token = payload.token ?? authorizationHeader;
  storeToken(token);

  return payload;
}
