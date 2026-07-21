"use client";

import { usePlanet } from "../hooks/usePlanet";

export function PlanetDetails() {
  const { selectedPlanet } = usePlanet();

  if (!selectedPlanet) {
    return <p className="text-white">Cap planeta seleccionat.</p>;
  }

  return (
    <article className="planet-details p-4 bg-white bg-opacity-5 rounded">
      <h2 className="text-xl font-semibold">{selectedPlanet.name}</h2>
      <p className="text-sm text-gray-200">{selectedPlanet.description}</p>
      <p className="mt-2 text-sm">Diàmetre: {selectedPlanet.diameter} km</p>
      <p className="text-sm">Llunes: {selectedPlanet.moons}</p>
    </article>
  );
}
