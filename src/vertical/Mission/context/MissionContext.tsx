"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Mission } from "../domain/Mission";
import { TravelHistoryContext } from "../../TravelHistory/context/TravelHistoryContext";
import { PlanetContext } from "../../Plantet/context/PlanetContext";

const STORAGE_KEY = "missionState";

type MissionContextValue = {
  mission: Mission | null;
  startMission: (mission: Mission) => void;
  updateProgress: (progress: number) => void;
};

export const MissionContext = createContext<MissionContextValue | undefined>(undefined);

export function MissionProvider({ children }: { children: React.ReactNode }) {
  const travelHistory = useContext(TravelHistoryContext);
  const planetContext = useContext(PlanetContext);
  const [mission, setMission] = useState<Mission | null>(null);

  useEffect(() => {
    const savedMission = localStorage.getItem(STORAGE_KEY);
    if (!savedMission) return;

    try {
      setMission(JSON.parse(savedMission) as Mission);
    } catch {
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mission));
    if (mission?.status !== "completed") return;

    planetContext?.setCurrentPlanet(mission.destinationPlanet);
    if (
      travelHistory &&
      !travelHistory.history.some((item) => item.id === mission.id)
    ) {
      travelHistory.addTravel({
        id: mission.id,
        originPlanet: mission.originPlanet.name,
        destinationPlanet: mission.destinationPlanet.name,
        speed: mission.speed,
        travelTime: mission.travelTime,
        arrivalDate: new Date().toLocaleString(),
        special:
          mission.destinationPlanet.distanceToSun >= 500 ||
          mission.travelTime > 100,
      });
    }
  }, [mission, planetContext, travelHistory]);

  useEffect(() => {
    if (mission?.status !== "travelling") return;

    const interval = window.setInterval(() => {
      setMission((current) => {
        if (!current || current.status !== "travelling") return current;

        const progress = Math.min(
          100,
          current.progress + 100 / Math.max(1, current.travelTime)
        );

        return {
          ...current,
          progress,
          status: progress >= 100 ? "completed" : current.status,
        };
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [mission?.status]);

  return (
    <MissionContext.Provider
      value={{
        mission,
        startMission: setMission,
        updateProgress: (progress: number) =>
          setMission((m) => (m ? { ...m, progress } : m)),
      }}
    >
      {children}
    </MissionContext.Provider>
  );
}
