"use client";

import { createContext, useState } from "react";
import { defaultShip } from "../infrastructure/defaultShip";
import type { SpaceShip } from "../domain/SpaceShip";

export interface SpaceShipContextType {
  ship: SpaceShip;

  changeSpeed: (speed: number) => void;

  updateFuel: (fuel: number) => void;
}

export const SpaceShipContext = createContext<SpaceShipContextType | undefined>(undefined);

export function SpaceShipProvider({ children }: { children: React.ReactNode }) {
  const [ship, setShip] = useState<SpaceShip>(defaultShip);

  const changeSpeed = (speed: number) => {
    setShip((currentShip) => ({ ...currentShip, speed }));
  };

  const updateFuel = (fuel: number) => {
    setShip((currentShip) => ({ ...currentShip, fuel }));
  };

  return (
    <SpaceShipContext.Provider value={{ ship, changeSpeed, updateFuel }}>
      {children}
    </SpaceShipContext.Provider>
  );
}