"use client";

import { useMission } from "../hooks/useMission";
import { usePlanet } from "../../Plantet/hooks/usePlanet";
import { useSpaceShip } from "../../SpaceShip/hooks/useSpaceShip";
import { calculateTravelTime } from "../utils/calculateTimeTravel";
import type { Mission } from "../domain/Mission";

export function StartMissionButton() {
  const missionContext = useMission();
  const planetContext = usePlanet();
  const { ship } = useSpaceShip();

  const isTravelling = missionContext?.mission?.status === "travelling";
  const hasDestination = !!planetContext.selectedPlanet;
  const isSamePlanet = planetContext.selectedPlanet?.id === planetContext.currentPlanet.id;

  const handleStart = () => {
    if (!missionContext || !planetContext.selectedPlanet) {
      return;
    }

    const originPlanet = planetContext.currentPlanet;
    const destinationPlanet = planetContext.selectedPlanet;

    if (originPlanet.id === destinationPlanet.id) {
      return;
    }

    const distance = Math.abs(
      originPlanet.distanceToSun - destinationPlanet.distanceToSun
    );

    const travelTime = calculateTravelTime(distance, ship.speed);
    const mission: Mission = {
      id: crypto.randomUUID?.() ?? `${Date.now()}`,
      originPlanet,
      destinationPlanet,
      speed: ship.speed,
      travelTime,
      progress: 0,
      status: "travelling",
      visitedPlanets: [originPlanet],
    };

    missionContext.startMission(mission);
  };

  return (
    <button
      className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-400 text-white font-bold py-2 px-4 rounded"
      onClick={handleStart}
      disabled={!hasDestination || isTravelling || isSamePlanet}
    >
      {isTravelling
        ? "Missió en curs"
        : !hasDestination
        ? "Selecciona un destí"
        : isSamePlanet
        ? "Ja ets aquí"
        : "Inicia missió"}
    </button>
  );
}
