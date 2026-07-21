import type { Planet } from "../domain/Mission";

export function MissionHistory({ visitedPlanets }: { visitedPlanets: Planet[] }) {
  return (
    <section className="mission-history">
      <h2>Planetes visitats</h2>
      {visitedPlanets.length === 0 ? (
        <p>Encara no s'ha visitat cap planeta.</p>
      ) : (
        <ul>
          {visitedPlanets.map((planet) => (
            <li key={planet.id}>{planet.name}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
