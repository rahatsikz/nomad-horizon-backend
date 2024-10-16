import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";
import { Weekdays } from "./schedule.constant";
import { parseTimeToMintutes } from "../service/service.utils";
import { formatTime } from "./schedule.utils";

const getSchedulesOfAvailablity = async ({
  serviceId,
  date,
}: {
  serviceId?: string;
  date?: Date;
}) => {
  const bookings = await prisma.booking.findMany({
    where: {
      serviceId,
      date,
    },
  });

  const service = await prisma.service.findUnique({
    where: {
      id: serviceId,
    },
    include: {
      schedules: true,
    },
  });

  if (!date) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Date is required");
  }

  const selectedDate = new Date(date).getDay();
  const selectedDay = Weekdays[selectedDate];

  const serviceForSelectedDay = service?.schedules.find(
    (schedule) => schedule.daysOfWeek === selectedDay
  );
  //   console.log(serviceForSelectedDay);

  if (!serviceForSelectedDay) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Service is not available on ${selectedDay}`
    );
  }

  const availableMinutes =
    parseTimeToMintutes(serviceForSelectedDay?.endTime) -
    parseTimeToMintutes(serviceForSelectedDay?.startTime);

  const sessionDuration = serviceForSelectedDay?.eachSessionDuration;
  const startHourInMinutes = parseTimeToMintutes(
    serviceForSelectedDay?.startTime
  );

  const totalSessions = Math.floor(availableMinutes / sessionDuration);

  //   console.log(totalSessions);

  const schedule = Array.from({ length: totalSessions }).map((_, index) => {
    const startTime = new Date();
    // initial time
    startTime.setHours(startHourInMinutes / 60);
    startTime.setMinutes(0);
    // add session duration
    startTime.setMinutes(startTime.getMinutes() + index * sessionDuration);
    const endTime = new Date(startTime.getTime() + sessionDuration * 60 * 1000);

    const isSessionAvailable = bookings.find(
      (item) =>
        item.startTime === formatTime(startTime) &&
        item.endTime === formatTime(endTime)
    );

    return {
      sessionStarts: formatTime(startTime),
      sessionEnds: formatTime(endTime),
      available: isSessionAvailable ? false : true,
    };
  });
  //   console.log(schedule);
  return schedule;
};

export const ScheduleService = {
  getSchedulesOfAvailablity,
};
