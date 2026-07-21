export interface SpaceShip {
  id: string;
  name: string;
  speed: number;
  image: string;
  fuel: number;
  status: "stopped" | "travelling";
}