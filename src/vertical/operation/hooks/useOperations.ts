"use client";

import { useCallback, useState } from "react";
import type { BizumPayload, TransferPayload } from "../domain/Operation";
import {
  OperationApiError,
  sendBizum,
  sendTransfer,
} from "../infrastructure/operationsApi";
import type { OperationText } from "../utils/operationTranslations";
import { clearAuthToken } from "../../user/infrastructure/loginUser";

export function useOperations(text: OperationText) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toMessage = useCallback((requestError: unknown): string => {
    if (requestError instanceof OperationApiError && requestError.status === 401) {
      clearAuthToken();
      return text.sessionExpired;
    }

    const detail = requestError instanceof Error ? requestError.message : "";
    const normalized = detail.toLowerCase();

    if (normalized.includes("insufficient funds")) return text.insufficientFunds;
    if (normalized.includes("must be different")) return text.sameAccount;
    if (normalized.includes("greater than zero")) return text.invalidAmount;
    if (normalized.includes("phone") && normalized.includes("found")) return text.recipientNotFound;
    if (normalized.includes("destination account not found")) return text.recipientNotFound;

    return detail || text.unavailable;
  }, [text.insufficientFunds, text.invalidAmount, text.recipientNotFound, text.sameAccount, text.sessionExpired, text.unavailable]);

  const submit = useCallback(async (
    operation: () => Promise<void>,
    successMessage: string,
  ): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      await operation();
      setMessage(successMessage);
      return true;
    } catch (requestError) {
      setError(toMessage(requestError));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [toMessage]);

  const transfer = useCallback((payload: TransferPayload) => submit(
    () => sendTransfer(payload),
    text.successTransfer,
  ), [submit, text.successTransfer]);

  const bizum = useCallback((payload: BizumPayload) => submit(
    () => sendBizum(payload),
    text.successBizum,
  ), [submit, text.successBizum]);

  const clearFeedback = useCallback(() => {
    setError(null);
    setMessage(null);
  }, []);

  return {
    isSubmitting,
    message,
    error,
    transfer,
    bizum,
    clearFeedback,
  };
}
