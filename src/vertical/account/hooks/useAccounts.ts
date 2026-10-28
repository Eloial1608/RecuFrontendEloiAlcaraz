"use client";

import { useCallback, useEffect, useState } from "react";
import type { Account, AccountType, AccountUpdatePayload } from "../domain/Account";
import {
  AccountApiError,
  createAccount,
  deleteAccount,
  getAccount,
  getMyAccounts,
  updateAccount,
  updateAccountBalance,
} from "../infrastructure/accountsApi";
import type { AccountText } from "../utils/accountTranslations";
import { clearAuthToken } from "../../user/infrastructure/loginUser";

export function useAccounts(text: AccountText) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toMessage = useCallback((requestError: unknown, fallback: string): string => {
    if (requestError instanceof AccountApiError && requestError.status === 401) {
      clearAuthToken();
      return text.sessionExpired;
    }

    return requestError instanceof Error && requestError.message
      ? requestError.message
      : fallback;
  }, [text.sessionExpired]);

  const fetchAccounts = useCallback(async () => {
    const response = await getMyAccounts();
    setAccounts(response.data.accounts);
  }, []);

  const loadAccounts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await fetchAccounts();
    } catch (requestError) {
      setError(toMessage(requestError, text.genericError));
    } finally {
      setIsLoading(false);
    }
  }, [fetchAccounts, text.genericError, toMessage]);

  useEffect(() => {
    void loadAccounts();
  }, [loadAccounts]);

  const run = useCallback(async (
    operation: () => Promise<void>,
    successMessage: string,
    fallback: string,
  ): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      await operation();
      setMessage(successMessage);
      return true;
    } catch (requestError) {
      setError(toMessage(requestError, fallback));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [toMessage]);

  const create = useCallback((typeAccount: AccountType) => run(
    async () => {
      await createAccount(typeAccount);
      await fetchAccounts();
    },
    text.created,
    text.genericError,
  ), [fetchAccounts, run, text.created, text.genericError]);

  const update = useCallback((accountId: string, payload: AccountUpdatePayload) => run(
    async () => {
      await updateAccount(accountId, payload);
      await fetchAccounts();
    },
    text.saved,
    text.genericError,
  ), [fetchAccounts, run, text.genericError, text.saved]);

  const updateBalance = useCallback((accountId: string, balance: number) => run(
    async () => {
      await updateAccountBalance(accountId, balance);
      await fetchAccounts();
    },
    text.updated,
    text.genericError,
  ), [fetchAccounts, run, text.genericError, text.updated]);

  const remove = useCallback((accountId: string) => run(
    async () => {
      await deleteAccount(accountId);
      await fetchAccounts();
    },
    text.deleted,
    text.genericError,
  ), [fetchAccounts, run, text.deleted, text.genericError]);

  const loadDetails = useCallback(async (accountId: string): Promise<Account | null> => {
    setError(null);
    try {
      return await getAccount(accountId);
    } catch (requestError) {
      setError(toMessage(requestError, text.detailsError));
      return null;
    }
  }, [text.detailsError, toMessage]);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      await fetchAccounts();
    } catch (requestError) {
      setError(toMessage(requestError, text.genericError));
    }
  }, [fetchAccounts, text.genericError, toMessage]);

  const clearFeedback = useCallback(() => {
    setError(null);
    setMessage(null);
  }, []);

  return {
    accounts,
    isLoading,
    isSubmitting,
    message,
    error,
    create,
    update,
    updateBalance,
    remove,
    loadDetails,
    refresh,
    clearFeedback,
  };
}
