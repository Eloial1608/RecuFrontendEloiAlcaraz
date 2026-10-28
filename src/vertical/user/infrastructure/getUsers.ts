import type { User } from "../domain/User";
import { getAuthHeader } from "./loginUser";

function normalizeUserResponse(payload: unknown): User {
  if (!payload || typeof payload !== "object") {
    throw new Error("User profile payload is empty.");
  }

  const candidate = payload as Record<string, unknown>;
  const directUser = candidate.user ?? candidate.data ?? candidate.profile ?? payload;

  if (!directUser || typeof directUser !== "object") {
    throw new Error("User profile payload is not valid.");
  }

  const user = directUser as Record<string, unknown>;

  return {
    id: (user.id as string | undefined) ?? (user._id as string | undefined),
    name: (user.name as string) ?? "",
    username: (user.username as string) ?? "",
    email: (user.email as string) ?? "",
    password: (user.password as string) ?? "",
    isAdmin: Boolean(user.isAdmin),
    identityDocType: (user.identityDocType as string) ?? "",
    identityDocNumber: (user.identityDocNumber as string) ?? "",
    companyName: ((user.companyName as string | undefined) ?? (user.company_name as string | undefined) ?? (user.company as string | undefined) ?? ""),
    phoneNumber: (user.phoneNumber as string) ?? "",
    birthDate: (user.birthDate as string) ?? "",
    address: (user.address as string) ?? "",
    city: (user.city as string) ?? "",
    zipCode: ((user.zipCode as string | undefined) ?? (user.zip_code as string | undefined) ?? ""),
    createdAt: (user.createdAt as string | undefined) ?? (user.created_at as string | undefined),
    updatedAt: (user.updatedAt as string | undefined) ?? (user.updated_at as string | undefined),
  } as User;
}

async function readApiError(response: Response): Promise<string> {
  const text = await response.text();

  if (!text) return `Request failed (${response.status}).`;

  try {
    const parsed = JSON.parse(text) as { message?: string; error?: string; errors?: unknown };
    return parsed.message ?? parsed.error ?? JSON.stringify(parsed);
  } catch {
    return text;
  }
}

export async function getMe(): Promise<User> {
  const response = await fetch("/api/me", {
    method: "GET",
    headers: {
      ...getAuthHeader(),
    },
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  const payload = await response.json();
  return normalizeUserResponse(payload);
}

export async function updateMe(payload: Partial<User>): Promise<void> {
  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  ) as Partial<User>;

  const response = await fetch("/api/me", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(cleanPayload),
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }
}

export async function updatePassword(userId: string, password: string): Promise<void> {
  const response = await fetch(`/api/users/password/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ password }),
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }
}

export async function updateUser(userId: string, payload: Partial<User>): Promise<void> {
  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  ) as Partial<User>;

  const response = await fetch(`/api/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(cleanPayload),
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }
}

export async function deleteUser(userId: string): Promise<void> {
  const response = await fetch(`/api/users/${userId}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeader(),
    },
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }
}
