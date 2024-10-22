import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";
import { Weekdays } from "./schedule.constant";
import {
  parseTimeToMintutes,
  validateSchedule,
} from "../service/service.utils";
import { formatTime } from "./schedule.utils";
import { Schedule } from "@prisma/client";

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

  if (!serviceId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Service id is required");
  }

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

const getSpecificServiceSchedule = async (serviceId: string) => {
  const result = await prisma.schedule.findMany({
    where: {
      service: {
        id: serviceId,
      },
    },
  });
  return result;
};

const updateSchedule = async (id: string, payload: Partial<Schedule[]>) => {
  const choosenService = await prisma.service.findUnique({
    where: {
      id,
    },
    include: {
      schedules: true,
    },
  });

  if (payload.length > 0) {
    for (let i = 0; i < payload.length; i++) {
      const element = payload[i];

      if (!element) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Schedule has not found");
      }

      const isValidSchedule = validateSchedule(
        element.startTime,
        element.endTime,
        element.eachSessionDuration
      );

      if (!isValidSchedule) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `${element.daysOfWeek} schedule is not valid`
        );
      }

      if (
        choosenService?.schedules.find(
          (schedule) => schedule.daysOfWeek === element.daysOfWeek
        )
      ) {
        const existingSchedule = choosenService?.schedules.find(
          (schedule) => schedule.daysOfWeek === element.daysOfWeek
        );
        await prisma.schedule.update({
          where: {
            id: existingSchedule?.id,
          },
          data: {
            startTime: element.startTime,
            endTime: element.endTime,
            eachSessionDuration: element.eachSessionDuration,
            daysOfWeek: element.daysOfWeek,
          },
        });
      } else {
        await prisma.schedule.create({
          data: {
            startTime: element.startTime,
            endTime: element.endTime,
            eachSessionDuration: element.eachSessionDuration,
            daysOfWeek: element.daysOfWeek,
            serviceId: id,
          },
        });
      }

      const schedulesToDelete = choosenService?.schedules.filter(
        (schedule) =>
          !payload.some(
            (updatedSchedule) =>
              updatedSchedule?.daysOfWeek === schedule.daysOfWeek
          )
      );

      if (schedulesToDelete && schedulesToDelete.length > 0) {
        for (let schedule of schedulesToDelete) {
          await prisma.schedule.delete({
            where: { id: schedule.id },
          });
        }
      }
    }
  }

  return choosenService?.schedules;
};

export const ScheduleService = {
  getSchedulesOfAvailablity,
  getSpecificServiceSchedule,
  updateSchedule,
};
