"use client";

import { useMission } from "../../Mission/hooks/useMission";

export function SpaceShipAnimation() {
  const missionContext = useMission();
  const progress = missionContext?.mission?.progress ?? 0;

  return (
    <div className="spaceship-animation relative w-full h-20 rounded-lg bg-slate-900 overflow-hidden border border-gray-700">
      <div
        className="absolute inset-y-0 left-0 from-sky-500/30 to-transparent"
        style={{ width: `${progress}%` }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 text-3xl transition-all duration-500"
        style={{ left: `${Math.min(95, progress)}%` }}
      >
        🚀
      </div>
      <div className="absolute bottom-2 left-3 text-xs text-gray-300">
        Progrés de la missió: {Math.round(progress)}%
      </div>
    </div>
  );
}