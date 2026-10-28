export interface Movement {
  id: string;
  accountId: string;
  amount: number;
  type: string;
  transferId?: string | null;
  description?: string | null;
  relatedAccountId?: string | null;
  cardId?: string | null;
  createdAt: string;
}

export interface MovementsResponse {
  message?: string;
  data: {
    movements: Movement[];
  };
}
