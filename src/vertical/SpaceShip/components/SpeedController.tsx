"use client";

import { useSpaceShip } from "../hooks/useSpaceShip";

export function SpeedController() {
  const { ship, changeSpeed } = useSpaceShip();

  const handleIncreaseSpeed = () => {
    const newSpeed = Math.min(ship.speed + 1000, 10000);
    changeSpeed(newSpeed);
  };

  const handleDecreaseSpeed = () => {
    const newSpeed = Math.max(ship.speed - 1000, 0);
    changeSpeed(newSpeed);
  };

  return (
    <div className="speed-controller">
      <button
        onClick={handleIncreaseSpeed}
        aria-label="Augmentar velocitat"
      >
        +
      </button>
      <span className="speed-display">{ship.speed}</span>
      <button
        onClick={handleDecreaseSpeed}
        aria-label="Disminuir velocitat"
      >
        -
      </button>
    </div>
  );
}