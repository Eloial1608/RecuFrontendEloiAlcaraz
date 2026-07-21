import { Planet } from "../../Plantet/domain/Planet";

export type { Planet } from "../../Plantet/domain/Planet";

export interface Mission {
  id: string;
  originPlanet: Planet;
  destinationPlanet: Planet;
  speed: number;
  travelTime: number;
  progress: number;
  status: "waiting" | "travelling" | "completed";

  visitedPlanets: Planet[];
}