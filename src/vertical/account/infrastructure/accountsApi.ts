import { getAuthHeader } from "../../user/infrastructure/loginUser";
import {
  ACCOUNT_TYPES,
  type Account,
  type AccountType,
  type AccountUpdatePayload,
  type AccountWriteResponse,
  type AccountsResponse,
} from "../domain/Account";

export class AccountApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "AccountApiError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isAccountType(value: string): value is AccountType {
  return (ACCOUNT_TYPES as readonly string[]).includes(value);
}

function extractAccount(payload: unknown): unknown {
  if (!isRecord(payload)) return payload;

  const data = payload.data;
  if (isRecord(data) && isRecord(data.account)) return data.account;
  if (isRecord(payload.account)) return payload.account;

  return payload;
}

function normalizeAccount(payload: unknown): Account {
  const candidate = extractAccount(payload);

  if (!isRecord(candidate)) {
    throw new Error("Invalid account response.");
  }

  const { id, iban, balance, typeAccount } = candidate;

  if (
    typeof id !== "string" ||
    typeof iban !== "string" ||
    typeof balance !== "number" ||
    typeof typeAccount !== "string" ||
    !isAccountType(typeAccount)
  ) {
    throw new Error("Invalid account response.");
  }

  return {
    id,
    iban,
    balance,
    typeAccount,
    idUser: typeof candidate.idUser === "string" ? candidate.idUser : undefined,
    phoneNumber: typeof candidate.phoneNumber === "string" || candidate.phoneNumber === null
      ? candidate.phoneNumber
      : undefined,
    createdAt: typeof candidate.createdAt === "string" ? candidate.createdAt : undefined,
    updatedAt: typeof candidate.updatedAt === "string" ? candidate.updatedAt : undefined,
    deletedAt: typeof candidate.deletedAt === "string" || candidate.deletedAt === null
      ? candidate.deletedAt
      : undefined,
  };
}

function normalizeWriteResponse(payload: unknown): AccountWriteResponse {
  if (!isRecord(payload)) return {};

  const data = isRecord(payload.data) ? payload.data : undefined;
  const account = data && isRecord(data.account) ? data.account : undefined;

  return {
    message: typeof payload.message === "string" ? payload.message : undefined,
    accountId: account && typeof account.id === "string" ? account.id : undefined,
  };
}

function normalizeAccountsResponse(payload: unknown): AccountsResponse {
  if (Array.isArray(payload)) {
    return { data: { accounts: payload.map(normalizeAccount) } };
  }

  if (!isRecord(payload)) {
    throw new Error("Invalid accounts response.");
  }

  const data = payload.data;
  const accounts = Array.isArray(payload.accounts)
    ? payload.accounts
    : isRecord(data) && Array.isArray(data.accounts)
      ? data.accounts
      : null;

  if (!accounts) throw new Error("Invalid accounts response.");

  return {
    message: typeof payload.message === "string" ? payload.message : undefined,
    data: { accounts: accounts.map(normalizeAccount) },
  };
}

async function readApiError(response: Response): Promise<string> {
  const text = await response.text();
  if (!text) return `Request failed (${response.status}).`;

  try {
    const payload = JSON.parse(text) as { message?: string; error?: string };
    return payload.message ?? payload.error ?? text;
  } catch {
    return text;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: {
      ...getAuthHeader(),
      ...options.headers,
    },
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    const detail = await readApiError(response);
    const message = response.status === 401
      ? "Your session is invalid or has expired."
      : response.status === 500
        ? "The accounts service is temporarily unavailable."
        : detail;
    throw new AccountApiError(response.status, message);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export async function createAccount(typeAccount: AccountType): Promise<AccountWriteResponse> {
  const payload = await request<unknown>("/api/account", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ typeAccount }),
  });

  return normalizeWriteResponse(payload);
}

export function getMyAccounts(): Promise<AccountsResponse> {
  return request<unknown>("/api/accounts").then(normalizeAccountsResponse);
}

export async function getAccount(accountId: string): Promise<Account> {
  const payload = await request<unknown>(`/api/account/${encodeURIComponent(accountId)}`);
  return normalizeAccount(payload);
}

export async function updateAccount(
  accountId: string,
  account: AccountUpdatePayload,
): Promise<AccountWriteResponse> {
  const payload = await request<unknown>(`/api/account/${encodeURIComponent(accountId)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(account),
  });

  return normalizeWriteResponse(payload);
}

export async function updateAccountBalance(
  accountId: string,
  balance: number,
): Promise<AccountWriteResponse> {
  const payload = await request<unknown>(`/api/account/${encodeURIComponent(accountId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ balance }),
  });

  return normalizeWriteResponse(payload);
}

export async function deleteAccount(accountId: string): Promise<void> {
  await request<void>(`/api/account/${encodeURIComponent(accountId)}`, { method: "DELETE" });
}
