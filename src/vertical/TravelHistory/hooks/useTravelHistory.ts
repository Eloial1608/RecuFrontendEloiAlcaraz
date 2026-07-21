import { useContext } from "react";
import { TravelHistoryContext } from "../context/TravelHistoryContext";

export const useTravelHistory = () => {
  return useContext(TravelHistoryContext);
};
