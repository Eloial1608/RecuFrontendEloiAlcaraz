"use client";

import { useSpaceShip } from "../hooks/useSpaceShip";

export function SpaceShipInfo() {
  const { ship } = useSpaceShip();

  return (
    <section className="spaceship-info">
      <div className="info-item">
        <label>Velocitat:</label>
        <span>{ship.speed} km/h</span>
      </div>
      <div className="info-item">
        <label>Combustible:</label>
        <span>{ship.fuel}%</span>
      </div>
      <div className="info-item">
        <label>Estat:</label>
        <span className={`status status-${ship.status}`}>{ship.status}</span>
      </div>
    </section>
  );
}