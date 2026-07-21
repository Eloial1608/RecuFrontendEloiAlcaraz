import { SpaceShip } from "../domain/SpaceShip";

export const defaultShip: SpaceShip = {
  id: "apollo",
  name: "Apollo Explorer",
  speed: 5000,
  image: "/images/spaceship.png",
  fuel: 100,
  status: "stopped"
};