import { getAuthHeader } from "../../user/infrastructure/loginUser";
import type { BizumPayload, TransferPayload } from "../domain/Operation";

export class OperationApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "OperationApiError";
  }
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

async function sendOperation(body: unknown): Promise<void> {
  const response = await fetch("/api/bank-operation", {
    method: "POST",
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    const detail = await readApiError(response);
    const message = response.status === 401
      ? "Your session is invalid or has expired."
      : response.status === 500
        ? "The bank operation service is temporarily unavailable."
        : detail;
    throw new OperationApiError(response.status, message);
  }

  await response.text();
}

export async function sendTransfer(payload: TransferPayload): Promise<void> {
  await sendOperation({ type: "TRANSFER", payload });
}

export async function sendBizum(payload: BizumPayload): Promise<void> {
  await sendOperation({ type: "BIZUM", payload });
}
