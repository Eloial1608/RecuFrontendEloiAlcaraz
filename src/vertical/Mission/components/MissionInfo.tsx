import type { Mission } from "../domain/Mission";

export function MissionInfo({ mission }: { mission: Mission }) {
  return (
    <section className="mission-info">
      <p>Origen: {mission.originPlanet.name}</p>
      <p>Destí: {mission.destinationPlanet.name}</p>
      <p>Velocitat: {mission.speed} km/h</p>
      <p>Temps de viatge: {mission.travelTime} h</p>
      <p>Estat: {mission.status}</p>
    </section>
  );
}
