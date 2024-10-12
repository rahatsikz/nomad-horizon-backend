import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";
import { validateSchedule } from "./service.utils";

const createService = async (payload: any) => {
  const { schedule, ...otherPayload } = payload;

  const createdService = await prisma.$transaction(async (tx) => {
    const newService = await tx.service.create({
      data: otherPayload,
    });

    if (!newService) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Service has not been created"
      );
    }

    if (schedule.length > 0) {
      for (let i = 0; i < schedule.length; i++) {
        const element = schedule[i];

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

        await tx.schedule.create({
          data: {
            startTime: element.startTime,
            endTime: element.endTime,
            eachSessionDuration: element.eachSessionDuration,
            daysOfWeek: element.daysOfWeek,
            serviceId: newService.id,
          },
        });
      }
    }
    return newService;
  });

  const result = await prisma.service.findUnique({
    where: {
      id: createdService.id,
    },
    include: {
      schedules: {
        select: {
          daysOfWeek: true,
          startTime: true,
          endTime: true,
          eachSessionDuration: true,
        },
      },
    },
  });

  return result;
};

const getAllServices = async () => {
  const result = await prisma.service.findMany({
    include: {
      schedules: {
        select: {
          daysOfWeek: true,
          startTime: true,
          endTime: true,
          eachSessionDuration: true,
        },
      },
    },
  });
  return result;
};

const getServiceById = async (id: string) => {
  const result = await prisma.service.findUnique({
    where: {
      id,
    },
    include: {
      schedules: {
        select: {
          daysOfWeek: true,
          startTime: true,
          endTime: true,
          eachSessionDuration: true,
        },
      },
    },
  });
  return result;
};

export const ServiceService = {
  createService,
  getAllServices,
  getServiceById,
};
