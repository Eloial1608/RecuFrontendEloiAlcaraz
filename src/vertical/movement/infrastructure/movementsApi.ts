import { getAuthHeader } from "../../user/infrastructure/loginUser";
import type { Movement, MovementsResponse } from "../domain/Movement";

export class MovementApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "MovementApiError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeMovement(payload: unknown): Movement {
  if (!isRecord(payload)) {
    throw new Error("Invalid movement response.");
  }

  const { id, accountId, amount, type, createdAt } = payload;

  if (
    typeof id !== "string" ||
    typeof accountId !== "string" ||
    typeof amount !== "number" ||
    typeof type !== "string" ||
    typeof createdAt !== "string"
  ) {
    throw new Error("Invalid movement response.");
  }

  return {
    id,
    accountId,
    amount,
    type,
    createdAt,
    transferId: typeof payload.transferId === "string" || payload.transferId === null
      ? payload.transferId
      : undefined,
    description: typeof payload.description === "string" || payload.description === null
      ? payload.description
      : undefined,
    relatedAccountId: typeof payload.relatedAccountId === "string" || payload.relatedAccountId === null
      ? payload.relatedAccountId
      : undefined,
    cardId: typeof payload.cardId === "string" || payload.cardId === null
      ? payload.cardId
      : undefined,
  };
}

function normalizeMovementsResponse(payload: unknown): MovementsResponse {
  if (Array.isArray(payload)) {
    return { data: { movements: payload.map(normalizeMovement) } };
  }

  if (!isRecord(payload)) {
    throw new Error("Invalid movements response.");
  }

  const data = payload.data;
  const movements = Array.isArray(payload.movements)
    ? payload.movements
    : isRecord(data) && Array.isArray(data.movements)
      ? data.movements
      : null;

  if (!movements) throw new Error("Invalid movements response.");

  return {
    message: typeof payload.message === "string" ? payload.message : undefined,
    data: { movements: movements.map(normalizeMovement) },
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

export async function getAccountMovements(accountId: string): Promise<MovementsResponse> {
  const response = await fetch(`/api/accounts/${encodeURIComponent(accountId)}/movements`, {
    headers: getAuthHeader(),
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    const detail = await readApiError(response);
    const message = response.status === 401
      ? "Your session is invalid or has expired."
      : response.status === 500
        ? "The movements service is temporarily unavailable."
        : detail;
    throw new MovementApiError(response.status, message);
  }

  return normalizeMovementsResponse(await response.json());
}
