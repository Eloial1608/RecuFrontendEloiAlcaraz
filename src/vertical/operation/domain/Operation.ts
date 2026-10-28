export interface TransferPayload {
  originAccountId: string;
  destinationAccountId: string;
  amount: number;
  description?: string;
}

export interface BizumPayload {
  originAccountId: string;
  phone: string;
  amount: number;
  description?: string;
}
