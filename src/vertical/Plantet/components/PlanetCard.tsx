import { Planet } from "../domain/Planet";

export function PlanetCard({ planet }: { planet: Planet }) {
  return (
    <div className="planet-card flex flex-col items-center gap-2 text-center p-3">
      <div className="w-20 h-20 mx-auto">
        <img
          src={planet.image}
          alt={planet.name}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="text-sm text-gray-200">{planet.name}</div>
    </div>
  );
}