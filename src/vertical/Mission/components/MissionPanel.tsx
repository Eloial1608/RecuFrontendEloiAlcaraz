"use client";

import { MissionInfo } from "./MissionInfo";
import { ProgressBar } from "./ProgressBar";
import { MissionHistory } from "./MissionHistory";
import { useMission } from "../hooks/useMission";

export function MissionPanel() {
  const missionContext = useMission();

  if (!missionContext?.mission) {
    return (
      <section className="mission-panel">
        <p>No hi ha cap missió actiu.</p>
      </section>
    );
  }

  const { mission } = missionContext;

  return (
    <section className="mission-panel">
      <header>
        <h1>Missió activa</h1>
        <p>
          {mission.originPlanet.name} → {mission.destinationPlanet.name}
        </p>
      </header>
      <MissionInfo mission={mission} />
      <ProgressBar progress={mission.progress} />
      <MissionHistory visitedPlanets={mission.visitedPlanets} />
    </section>
  );
}
