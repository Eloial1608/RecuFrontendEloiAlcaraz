export const CARD_TYPES = ["CREDIT_CARD", "DEBIT_CARD"] as const;

export type CardType = (typeof CARD_TYPES)[number];

export interface Card {
  id: string;
  accountId: string;
  numCard: string;
  type_Card: CardType;
  limitCard: number;
  balance: number;
  expiration: string;
  cvv: string;
  isBlocked: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface CardsResponse {
  message?: string;
  data: {
    cards: Card[];
  };
}

export interface CardCreatePayload {
  type_Card: CardType;
  cardPin: string;
  accountId: string;
}
