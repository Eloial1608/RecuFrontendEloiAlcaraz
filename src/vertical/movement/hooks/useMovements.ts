"use client";

import { useCallback, useEffect, useState } from "react";
import type { Movement } from "../domain/Movement";
import { MovementApiError, getAccountMovements } from "../infrastructure/movementsApi";
import type { MovementText } from "../utils/movementTranslations";
import { clearAuthToken } from "../../user/infrastructure/loginUser";

export function useMovements(accountId: string, text: MovementText, refreshKey = 0) {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toMessage = useCallback((requestError: unknown): string => {
    if (requestError instanceof MovementApiError && requestError.status === 401) {
      clearAuthToken();
      return text.sessionExpired;
    }

    return requestError instanceof Error && requestError.message
      ? requestError.message
      : text.unavailable;
  }, [text.sessionExpired, text.unavailable]);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setMovements([]);

    try {
      const response = await getAccountMovements(accountId);
      setMovements(response.data.movements);
    } catch (requestError) {
      setError(toMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }, [accountId, toMessage]);

  useEffect(() => {
    void load();
  }, [load, refreshKey]);

  return { movements, isLoading, error, reload: load };
}
