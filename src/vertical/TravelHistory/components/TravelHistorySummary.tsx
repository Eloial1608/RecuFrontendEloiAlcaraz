"use client";

import { useContext } from "react";
import { TravelHistoryContext } from "../context/TravelHistoryContext";

export function TravelHistorySummary() {
  const travelHistory = useContext(TravelHistoryContext);

  if (!travelHistory) {
    throw new Error("TravelHistoryContext is missing");
  }

  const totalTrips = travelHistory.history.length;
  const lastDestination =
    totalTrips > 0
      ? travelHistory.history[travelHistory.history.length - 1].destinationPlanet
      : null;

  return (
    <section className="travel-history-summary">
      <p>Viatges totals: {totalTrips}</p>
      <p>Últim destí: {lastDestination ?? "Cap viatge"}</p>
    </section>
  );
}