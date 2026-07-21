import { Mission } from "../domain/Mission";

export const saveMission = (
  mission: Mission
) => {
  localStorage.setItem(
    "mission",
    JSON.stringify(mission)
  );
};

export const getMission = () => {
  const data =
    localStorage.getItem("mission");

  return data
    ? JSON.parse(data)
    : null;
};