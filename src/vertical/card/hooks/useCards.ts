"use client";

import { useCallback, useEffect, useState } from "react";
import type { Card, CardCreatePayload } from "../domain/Card";
import {
  CardApiError,
  createCard,
  deleteCard,
  getMyCards,
  setCardBlocked,
  setCardLimit,
  setCardPin,
} from "../infrastructure/cardsApi";
import type { CardText } from "../utils/cardTranslations";
import { clearAuthToken } from "../../user/infrastructure/loginUser";

export function useCards(text: CardText) {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toMessage = useCallback((requestError: unknown, fallback: string): string => {
    if (requestError instanceof CardApiError && requestError.status === 401) {
      clearAuthToken();
      return text.sessionExpired;
    }

    return requestError instanceof Error && requestError.message
      ? requestError.message
      : fallback;
  }, [text.sessionExpired]);

  const fetchCards = useCallback(async () => {
    const response = await getMyCards();
    setCards(response.data.cards);
  }, []);

  const loadCards = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await fetchCards();
    } catch (requestError) {
      setError(toMessage(requestError, text.genericError));
    } finally {
      setIsLoading(false);
    }
  }, [fetchCards, text.genericError, toMessage]);

  useEffect(() => {
    void loadCards();
  }, [loadCards]);

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

  const create = useCallback((payload: CardCreatePayload) => run(
    async () => {
      await createCard(payload);
      await fetchCards();
    },
    text.created,
    text.genericError,
  ), [fetchCards, run, text.created, text.genericError]);

  const setLimit = useCallback((cardId: string, limit: number) => run(
    async () => {
      await setCardLimit(cardId, limit);
      await fetchCards();
    },
    text.limitUpdated,
    text.genericError,
  ), [fetchCards, run, text.genericError, text.limitUpdated]);

  const setBlocked = useCallback((cardId: string, isBlocked: boolean) => run(
    async () => {
      await setCardBlocked(cardId, isBlocked);
      await fetchCards();
    },
    text.statusUpdated,
    text.genericError,
  ), [fetchCards, run, text.genericError, text.statusUpdated]);

  const changePin = useCallback((cardId: string, cardPin: string) => run(
    async () => {
      await setCardPin(cardId, cardPin);
      await fetchCards();
    },
    text.pinUpdated,
    text.genericError,
  ), [fetchCards, run, text.genericError, text.pinUpdated]);

  const remove = useCallback((cardId: string) => run(
    async () => {
      await deleteCard(cardId);
      await fetchCards();
    },
    text.deleted,
    text.genericError,
  ), [fetchCards, run, text.deleted, text.genericError]);

  const clearFeedback = useCallback(() => {
    setError(null);
    setMessage(null);
  }, []);

  return {
    cards,
    isLoading,
    isSubmitting,
    message,
    error,
    create,
    setLimit,
    setBlocked,
    changePin,
    remove,
    clearFeedback,
  };
}
