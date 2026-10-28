export const ACCOUNT_TYPES = ["CURRENT_ACCOUNT", "PAYROLL_ACCOUNT"] as const;

export type AccountType = (typeof ACCOUNT_TYPES)[number];

export interface Account {
  id: string;
  iban: string;
  balance: number;
  typeAccount: AccountType;
  idUser?: string;
  phoneNumber?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface AccountsResponse {
  message?: string;
  data: {
    accounts: Account[];
  };
}

export interface AccountWriteResponse {
  message?: string;
  accountId?: string;
}

export interface AccountUpdatePayload {
  iban: string;
  balance: number;
  typeAccount: AccountType;
}
