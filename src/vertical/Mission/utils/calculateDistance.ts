export const calculateDistance = (
  originDistance: number,
  destinationDistance: number
) => {

  return Math.abs(
    destinationDistance -
    originDistance
  );
};