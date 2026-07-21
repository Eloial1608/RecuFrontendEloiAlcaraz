"use client";

import { TravelHistoryCard } from "./TravelHistoryCard";
import { useTravelHistory } from "../hooks/useTravelHistory";

export function TravelHistoryList() {
  const travelHistory = useTravelHistory();

  if (!travelHistory) {
    throw new Error("TravelHistoryContext is missing");
  }

  if (travelHistory.history.length === 0) {
    return <p className="travel-history-empty">No hi ha viatges enregistrats.</p>;
  }

  return (
    <section className="travel-history-list">
      {travelHistory.history.map((travel) => (
        <TravelHistoryCard key={travel.id} travel={travel} />
      ))}
    </section>
  );
}