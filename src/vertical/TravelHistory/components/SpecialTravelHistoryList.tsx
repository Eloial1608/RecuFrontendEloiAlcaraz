"use client";

import { TravelHistoryCard } from "./TravelHistoryCard";
import { useTravelHistory } from "../hooks/useTravelHistory";

export function SpecialTravelHistoryList() {
  const travelHistory = useTravelHistory();

  if (!travelHistory) {
    throw new Error("TravelHistoryContext is missing");
  }

  const specialHistory = travelHistory.history.filter((travel) => travel.special);

  if (specialHistory.length === 0) {
    return <p className="travel-history-empty">No hi ha missions especials al registre.</p>;
  }

  return (
    <section className="travel-history-list">
      {specialHistory.map((travel) => (
        <TravelHistoryCard key={travel.id} travel={travel} />
      ))}
    </section>
  );
}
