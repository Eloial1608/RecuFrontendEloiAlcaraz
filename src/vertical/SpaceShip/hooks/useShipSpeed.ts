export const useShipSpeed = (
  initialSpeed: number
) => {

  const increaseSpeed = (
    speed: number
  ) => speed + 1000;

  const decreaseSpeed = (
    speed: number
  ) => speed - 1000;

  return {
    increaseSpeed,
    decreaseSpeed
  };
};