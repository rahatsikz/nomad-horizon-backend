import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";
import { validateSchedule } from "./service.utils";
import { Service } from "@prisma/client";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import { IPaginationOptions } from "../../../interface/pagination";

const createService = async (payload: any) => {
  const { schedule, ...otherPayload } = payload;

  const createdService = await prisma.$transaction(
    async (tx) => {
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
    },
    {
      maxWait: 5000,
      timeout: 10000,
    }
  );

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

const getAllServices = async (
  filters: {
    search?: string;
    category?: string;
    price?: number;
  },
  paginationOptions: IPaginationOptions
) => {
  const { page, limit, sortBy, sortOrder, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { search, ...restFilters } = filters;

  const conditions = [];

  if (search && search?.length > 0) {
    conditions.push({
      OR: ["serviceName"].map((key) => ({
        [key]: {
          contains: search,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(restFilters).length > 0) {
    conditions.push({
      AND: Object.keys(restFilters).map((key) => {
        if (key.includes("price")) {
          return {
            [key]: {
              lte: Number(restFilters[key as keyof typeof restFilters]),
            },
          };
        } else {
          return {
            [key]: restFilters[key as keyof typeof restFilters],
          };
        }
      }),
    });
  }

  const whereCondition = conditions.length > 0 ? { AND: conditions } : {};

  const result = await prisma.service.findMany({
    where: whereCondition,
    skip: skip,
    take: limit,
    orderBy:
      sortBy === "popularity"
        ? {
            reviews: {
              _count: sortOrder,
            },
          }
        : { [sortBy]: sortOrder },

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

  const total = await prisma.service.count({
    where: whereCondition,
  });
  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data: result,
  };
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

const updateService = async (id: string, payload: Partial<Service>) => {
  const result = await prisma.service.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteService = async (id: string) => {
  const deleteServiceWithSchedule = await prisma.$transaction(
    async (tx) => {
      const deleteSchedule = await tx.schedule.deleteMany({
        where: {
          service: {
            id,
          },
        },
      });
      if (!deleteSchedule) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Schedule has not been deleted"
        );
      }

      const deleteService = await tx.service.delete({
        where: {
          id,
        },
      });

      if (!deleteService) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Service has not been deleted"
        );
      }

      return deleteService;
    },
    {
      maxWait: 5000,
      timeout: 10000,
    }
  );

  return deleteServiceWithSchedule;
};

export const ServiceService = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};
