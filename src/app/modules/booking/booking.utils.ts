export const differenceInDays = (date1: Date, date2: Date) => {
  const msInADay = 24 * 60 * 60 * 1000; // number of milliseconds in a day
  const diffInMs = Math.abs(date1.getTime() - date2.getTime());
  return Math.floor(diffInMs / msInADay);
};
