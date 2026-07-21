import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { PlanetProvider } from "@/vertical/Plantet";
import { TravelHistoryProvider } from "@/vertical/TravelHistory";
import { SpaceShipProvider } from "@/vertical/SpaceShip";
import { MissionProvider } from "@/vertical/Mission";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Space Travel App",
  description: "Explore the universe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ca">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black/6 backdrop-blur-sm`}
      >
        <PlanetProvider>
          <TravelHistoryProvider>
            <SpaceShipProvider>
              <MissionProvider>
                {children}
              </MissionProvider>
            </SpaceShipProvider>
          </TravelHistoryProvider>
        </PlanetProvider>
      </body>
    </html>
  );
}