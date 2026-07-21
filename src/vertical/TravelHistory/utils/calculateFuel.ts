export const formatArrivalDate = (
  date: string
) => {

  return new Date(
    date
  ).toLocaleDateString();
};