import { TravelHistory } from "../domain/TravelHistory";

export const calculateTotalTravels = (
  history: TravelHistory[]
) => {

  return history.length;
};