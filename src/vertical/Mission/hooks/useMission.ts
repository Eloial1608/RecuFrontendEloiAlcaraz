import { useContext } from "react";
import { MissionContext } from "../context/MissionContext";

export const useMission = () => {
  return useContext(MissionContext);
};