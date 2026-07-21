import { useContext } from "react";
import { SpaceShipContext } from "../context/SpaceShipContext";

export function useSpaceShip() {
  const context = useContext(SpaceShipContext);

  if (context === undefined) {
    throw new Error("useSpaceShip must be used within a SpaceShipProvider");
  }

  return context;
}