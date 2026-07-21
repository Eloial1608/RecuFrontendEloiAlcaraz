export const useMissionProgress = (
  travelTime: number
) => {

  const calculateProgress = (
    elapsedTime: number
  ) => {

    return (
      elapsedTime /
      travelTime
    ) * 100;
  };

  return {
    calculateProgress
  };
};