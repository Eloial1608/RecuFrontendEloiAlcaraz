"use client";

import { createContext, useEffect, useState } from "react";
import { planets } from "../infrastructure/Planets";
import type { Planet } from "../domain/Planet";

interface PlanetContextType {
  selectedPlanet: Planet | null;
  currentPlanet: Planet;
  setSelectedPlanet: (planet: Planet) => void;
  setCurrentPlanet: (planet: Planet) => void;
}

const STORAGE_KEY = "planetContext";
const defaultPlanet = planets.find((planet) => planet.id === "terra") ?? planets[0];

export const PlanetContext = createContext<PlanetContextType | undefined>(undefined);

export function PlanetProvider({ children }: { children: React.ReactNode }) {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [currentPlanet, setCurrentPlanet] = useState<Planet>(defaultPlanet);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const { selectedPlanetId, currentPlanetId } = JSON.parse(saved) as {
        selectedPlanetId?: string;
        currentPlanetId?: string;
      };

      setCurrentPlanet(
        planets.find((planet) => planet.id === currentPlanetId) ?? defaultPlanet
      );
      setSelectedPlanet(
        planets.find((planet) => planet.id === selectedPlanetId) ?? null
      );
    } catch {
      // ignore malformed saved state
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        selectedPlanetId: selectedPlanet?.id,
        currentPlanetId: currentPlanet.id,
      })
    );
  }, [currentPlanet, selectedPlanet]);

  return (
    <PlanetContext.Provider
      value={{ selectedPlanet, currentPlanet, setSelectedPlanet, setCurrentPlanet }}
    >
      {children}
    </PlanetContext.Provider>
  );
}