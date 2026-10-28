import { getAuthHeader } from "../../user/infrastructure/loginUser";
import {
  CARD_TYPES,
  type Card,
  type CardCreatePayload,
  type CardsResponse,
  type CardType,
} from "../domain/Card";

export class CardApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "CardApiError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isCardType(value: string): value is CardType {
  return (CARD_TYPES as readonly string[]).includes(value);
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function extractCard(payload: unknown): unknown {
  if (!isRecord(payload)) return payload;

  const data = payload.data;
  if (isRecord(data) && isRecord(data.card)) return data.card;
  if (isRecord(payload.card)) return payload.card;

  return payload;
}

function normalizeCard(payload: unknown): Card {
  const candidate = extractCard(payload);

  if (!isRecord(candidate)) {
    throw new Error("Invalid card response.");
  }

  const { id, accountId, numCard, type_Card } = candidate;

  if (
    typeof id !== "string" ||
    typeof accountId !== "string" ||
    typeof numCard !== "string" ||
    typeof type_Card !== "string" ||
    !isCardType(type_Card)
  ) {
    throw new Error("Invalid card response.");
  }

  return {
    id,
    accountId,
    numCard,
    type_Card,
    limitCard: toNumber(candidate.limitCard),
    balance: toNumber(candidate.balance),
    expiration: typeof candidate.expiration === "string" ? candidate.expiration : "",
    cvv: typeof candidate.cvv === "string" ? candidate.cvv : "",
    isBlocked: candidate.isBlocked === true,
    createdAt: typeof candidate.createdAt === "string" ? candidate.createdAt : undefined,
    updatedAt: typeof candidate.updatedAt === "string" ? candidate.updatedAt : undefined,
    deletedAt: typeof candidate.deletedAt === "string" || candidate.deletedAt === null
      ? candidate.deletedAt
      : undefined,
  };
}

function normalizeCardsResponse(payload: unknown): CardsResponse {
  if (Array.isArray(payload)) {
    return { data: { cards: payload.map(normalizeCard) } };
  }

  if (!isRecord(payload)) {
    throw new Error("Invalid cards response.");
  }

  const data = payload.data;
  const cards = Array.isArray(payload.cards)
    ? payload.cards
    : isRecord(data) && Array.isArray(data.cards)
      ? data.cards
      : null;

  if (!cards) throw new Error("Invalid cards response.");

  return {
    message: typeof payload.message === "string" ? payload.message : undefined,
    data: { cards: cards.map(normalizeCard) },
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
        ? "The cards service is temporarily unavailable."
        : detail;
    throw new CardApiError(response.status, message);
  }

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  if (!text) return undefined as T;

  return JSON.parse(text) as T;
}

export function getMyCards(): Promise<CardsResponse> {
  return request<unknown>("/api/cards").then(normalizeCardsResponse);
}

export async function createCard(payload: CardCreatePayload): Promise<void> {
  await request<unknown>("/api/cards", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function setCardLimit(cardId: string, limit: number): Promise<void> {
  await request<unknown>(`/api/cards/limit/${encodeURIComponent(cardId)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ limit }),
  });
}

export async function setCardBlocked(cardId: string, isBlocked: boolean): Promise<void> {
  await request<unknown>(`/api/cards/isBlocked/${encodeURIComponent(cardId)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isBlocked }),
  });
}

export async function setCardPin(cardId: string, cardPin: string): Promise<void> {
  await request<unknown>(`/api/cards/cardPin/${encodeURIComponent(cardId)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cardPin }),
  });
}

export async function deleteCard(cardId: string): Promise<void> {
  await request<void>(`/api/cards/${encodeURIComponent(cardId)}`, { method: "DELETE" });
}
