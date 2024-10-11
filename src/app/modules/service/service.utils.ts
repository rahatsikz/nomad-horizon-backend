const parseTimeToMintutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const validateSchedule = (
  startTime: string,
  endTime: string,
  duration: number
) => {
  const startTimeInMinutes = parseTimeToMintutes(startTime);
  const endTimeInMinutes = parseTimeToMintutes(endTime);
  const timeDifference = endTimeInMinutes - startTimeInMinutes;
  if (timeDifference < duration) {
    return false;
  }
  return true;
};
