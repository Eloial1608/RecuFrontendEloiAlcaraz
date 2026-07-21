"use client";

import type { TravelHistory } from "../domain/TravelHistory";

export function TravelHistoryCard({ travel }: { travel: TravelHistory }) {
  return (
    <article className="travel-history-card border border-yellow-500/10 p-4 rounded bg-slate-950/80">
      <div className="flex items-center justify-between gap-3 mb-2">
        <h3 className="text-base font-semibold">{travel.originPlanet} → {travel.destinationPlanet}</h3>
        {travel.special && (
          <span className="text-[10px] uppercase tracking-[0.2em] text-yellow-300">
            Especial
          </span>
        )}
      </div>
      <p>Temps: {travel.travelTime} hores</p>
      <p>Velocitat: {travel.speed} km/h</p>
      <p>Arribada: {travel.arrivalDate}</p>
    </article>
  );
}