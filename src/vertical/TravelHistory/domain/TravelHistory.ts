export interface TravelHistory {
  id: string;
  originPlanet: string;
  destinationPlanet: string;
  speed: number;
  travelTime: number;
  arrivalDate: string;
  special?: boolean;
}