import { Planet } from "../domain/Planet";

export const planets: Planet[] = [
  {
    id: "mercury",
    name: "Mercuri",
    diameter: 4879,
    distanceToSun: 57.9,
    rotationTime: 58.6,
    mass: 0.33,
    moons: 0,
    description: "El planeta més proper al Sol",
    image: "/Mercury.png"
  },
  {
    id: "venus",
    name: "Venus",
    diameter: 12104,
    distanceToSun: 108.2,
    rotationTime: 243,
    mass: 4.87,
    moons: 0,
    description: "El planeta amb mes temperatura",
    image: "/Venus.png"
  },
  {
    id: "terra",
    name: "Terra",
    diameter: 12742,
    distanceToSun: 149.6,
    rotationTime: 24,
    mass: 5.97,
    moons: 1,
    description: "El nostre planeta",
    image: "/Terra.png"
  },
  {
    id: "mars",
    name: "Mart",
    diameter: 6779,
    distanceToSun: 227.9,
    rotationTime: 24.6,
    mass: 0.642,
    moons: 2,
    description: "El planeta vermell",
    image: "/Mars.png"
  },
  {
    id: "júpiter",
    name: "Júpiter",
    diameter: 139820,
    distanceToSun: 778.5,
    rotationTime: 9.9,
    mass: 1898,
    moons: 79,
    description: "El gegant gassos",
    image: "/Jupiter.png"
  },
  {
    id: "saturn",
    name: "Saturn",
    diameter: 116460,
    distanceToSun: 1433.5,
    rotationTime: 10.7,
    mass: 568,
    moons: 82,
    description: "El planeta dels anells",
    image: "/Saturn.png"
  },
  {
    id: "uranus",
    name: "Ura",
    diameter: 50724,
    distanceToSun: 2872.5,
    rotationTime: 17.2,
    mass: 86.8,
    moons: 27,
    description: "El planeta verd",
    image: "/Uranus.png"
  },
  {
    id: "neptune",
    name: "Neptu",
    diameter: 49528,
    distanceToSun: 4504,
    rotationTime: 16.1,
    mass: 102,
    moons: 14,
    description: "El planeta blau",
    image: "/Neptune.png"
  }

];