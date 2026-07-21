import type { Planet } from "../domain/Planet";

export default function PlanetDetalls({ planet }: { planet: Planet }) {
	return (
		<div>
			<p>Diàmetre: {planet.diameter}</p>
			<p>Llunes: {planet.moons}</p>
		</div>
	);
}