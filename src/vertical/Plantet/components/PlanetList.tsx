"use client";

import { usePlanets } from "../hooks/usePlanets";
import { usePlanet } from "../hooks/usePlanet";
import { PlanetCard } from "./PlanetCard";

export function PlanetList() {
  const planets = usePlanets();
  const { selectedPlanet, setSelectedPlanet } = usePlanet();

  if (!planets || planets.length === 0) {
    return <p className="text-white">No hi ha planetes disponibles.</p>;
  }

	return (
		<section className="planet-list space-y-4">
			{planets.map((planet) => (
				<button
					key={planet.id}
					type="button"
					onClick={() => setSelectedPlanet(planet)}
					className={`w-full p-3 rounded border transition-colors duration-150 text-left ${
						selectedPlanet?.id === planet.id
							? "border-green-400 bg-green-500/10"
							: "border-transparent bg-white bg-opacity-5 hover:border-gray-500 hover:bg-white/10"
						}`}
				>
					<PlanetCard planet={planet} />
				</button>
			))}
		</section>
	);
}