import { TravelHistory } from "../domain/TravelHistory";

export const saveHistory = (history: TravelHistory[]) => {
  if (typeof window === "undefined") return;

  localStorage.setItem("travelHistory", JSON.stringify(history));
};

export const getHistory = () => {
  if (typeof window === "undefined") return [];

  const data = localStorage.getItem("travelHistory");
  return data ? JSON.parse(data) : [];
};