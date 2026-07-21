"use client";

import { TravelHistorySummary, TravelHistoryList, SpecialTravelHistoryList} from "@/vertical/TravelHistory";
import { SpeedController, SpaceShipAnimation} from "@/vertical/SpaceShip";
import { PlanetList, PlanetDetails, usePlanet } from "@/vertical/Plantet";
import { StartMissionButton, useMission } from "@/vertical/Mission";

export default function HomePage() {
  const { currentPlanet, selectedPlanet } = usePlanet();
  const missionContext = useMission();
  const activeMission = missionContext?.mission;
  const selectedDestination = selectedPlanet?.name ?? "Cap destinació";

  return (
    <main className="relative min-h-screen p-6 text-white bg-black/10 backdrop-blur-sm overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

        <aside className="lg:col-span-3 card p-4">
          <h3 className="text-green-300 font-bold mb-3">[ REGISTRE DE MISSIÓ ]</h3>
          <div className="mb-4">
            <p className="text-sm text-gray-300">UBICACIÓ ACTUAL</p>
            <p className="text-lg font-semibold">{currentPlanet.name}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-300">DESTÍ SELECCIONAT</p>
            <p className="text-lg font-semibold">{selectedDestination}</p>
          </div>
          <div className="w-full bg-gray-800 h-3 rounded mt-2">
            <div className="bg-green-500 h-3 rounded" style={{ width: '12%' }} />
          </div>
          <p className="text-xs mt-2">PLANETES VISITATS</p>
          <div className="space-y-1 mt-2 text-sm text-gray-200">
            <p>Mercuri</p>
            <p>Venus</p>
            <p className="text-green-300">Terra</p>
          </div>
          <div className="mt-6">
            <TravelHistorySummary />
          </div>
        </aside>

        <section className="lg:col-span-6 card p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="px-3 py-1 bg-gray-800 border border-green-500 text-green-300 rounded">PLANETES</div>
            <div className="px-3 py-1 bg-gray-800 border text-gray-300 rounded">INFO</div>
          </div>

          <div className="card p-4">
            <p className="text-center text-sm mb-3">[ SELECCIONA DESTINACIÓ ]</p>
            <PlanetList />
            <p className="text-xs text-gray-400 mt-4 text-center">FES CLIC EN UN PLANETA PER SELECCIONAR-LO COM A DESTINACIÓ</p>
          </div>

          <div className="mt-6 card p-4">
            <PlanetDetails />
          </div>

          <div className="mt-6 card p-3">
            <h4 className="text-sm text-gray-300">[ ESTAT DE LA NAU ]</h4>
            <div className="mt-3">
              <SpaceShipAnimation />
            </div>
            <p className="text-xs text-gray-400 mt-2">{activeMission ? "Missió en curs" : "Nau preparada per iniciar"}</p>
          </div>
        </section>

        <aside className="lg:col-span-3 card p-4">
          <h3 className="text-yellow-300 font-bold mb-3">[ CONTROL DE NAVEGACIÓ ]</h3>
          <div className="mb-4">
            <p className="text-sm text-gray-300">
              VELOCITAT NAU: <span className="text-yellow-300">{missionContext?.mission ? missionContext.mission.speed : 100} KM/S</span>
            </p>
            <SpeedController />
          </div>

          <div className="mb-4 card p-3">
            <p className="text-sm text-gray-400">DESTÍ ACTUAL</p>
            <p className="text-xs text-gray-400 mt-2">{selectedDestination}</p>
          </div>

          <div>
            <StartMissionButton />
          </div>
        </aside>

      </div>

      <div className="max-w-7xl mx-auto mt-6 card p-4 space-y-6 relative z-10">
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Historial de missions especials</h2>
          <SpecialTravelHistoryList />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Historial complet</h2>
          <TravelHistoryList />
        </div>
      </div>
    </main>
  );
}