"use client";

import { createContext, useEffect, useState } from "react";
import { getHistory, saveHistory } from "../infrastructure/travelHistoryStorage";
import { TravelHistory } from "../domain/TravelHistory";

export interface TravelHistoryContextType {
  history: TravelHistory[];
  addTravel: (travel: TravelHistory) => void;
  clearHistory: () => void;
}

export const TravelHistoryContext = createContext<TravelHistoryContextType | undefined>(undefined);

export function TravelHistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<TravelHistory[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const addTravel = (travel: TravelHistory) => {
    setHistory((current) => [...current, travel]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <TravelHistoryContext.Provider value={{ history, addTravel, clearHistory }}>
      {children}
    </TravelHistoryContext.Provider>
  );
}