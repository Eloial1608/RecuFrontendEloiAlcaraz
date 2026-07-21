"use client";

import { useSpaceShip } from "../hooks/useSpaceShip";
import { SpaceShipAnimation } from "./SpaceShipAnimation";
import { SpaceShipInfo } from "./SpaceShipInfo";
import { SpeedController } from "./SpeedController";

export function SpaceShipCard() {
  const { ship } = useSpaceShip();

  return (
    <article className="spaceship-card">
      <header>
        <h2>{ship.name}</h2>
      </header>
      <SpaceShipAnimation />
      <SpaceShipInfo />
      <SpeedController />
    </article>
  );
}