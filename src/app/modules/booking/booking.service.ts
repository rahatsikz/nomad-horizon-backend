import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";
import { IBooking } from "./booking.interface";
import { BookingStatus } from "@prisma/client";
import { IPaginationOptions } from "../../../interface/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import { differenceInDays } from "./booking.utils";

const createBooking = async (payload: IBooking, userId: string) => {
  const result = await prisma.$transaction(
    async (tx) => {
      const newBooking = await tx.booking.create({
        data: {
          ...payload,
          userId,
        },
        include: {
          service: {
            select: {
              serviceName: true,
            },
          },
        },
      });

      if (!newBooking) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Booking has not been created"
        );
      }

      // create notification
      await tx.notification.create({
        data: {
          userId,
          content:
            "We got your booking request for " +
            newBooking.service.serviceName +
            ". Once it is approved, we will notify you.",
        },
      });

      return newBooking;
    },
    {
      maxWait: 5000,
      timeout: 10000,
    }
  );

  return result;
};

const customerSpecificBookings = async (userId: string) => {
  const result = await prisma.booking.findMany({
    where: {
      user: {
        id: userId,
      },
    },
    include: {
      service: {
        select: {
          serviceName: true,
        },
      },
    },
  });

  return result;
};

const cancelBooking = async (bookingId: string, userId: string) => {
  const result = await prisma.booking.update({
    where: {
      id: bookingId,
      userId,
    },
    data: {
      bookingStatus: BookingStatus.cancelled,
    },
  });

  return result;
};

const getAllBookings = async (
  filters: {
    bookingStatus?: BookingStatus;
    createdAt?: Date;
  },
  paginationOptions: IPaginationOptions
) => {
  const { page, limit, sortBy, sortOrder, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { bookingStatus, createdAt } = filters;

  const result = await prisma.booking.findMany({
    where: {
      bookingStatus: bookingStatus ? bookingStatus : undefined,
      createdAt: createdAt ? { lte: createdAt } : undefined,
    },
    skip: skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      service: {
        select: {
          serviceName: true,
          id: true,
        },
      },
      user: {
        select: {
          username: true,
          email: true,
        },
      },
    },
  });

  const total = await prisma.booking.count({
    where: {
      bookingStatus: bookingStatus ? bookingStatus : undefined,
      createdAt: createdAt ? { lte: createdAt } : undefined,
    },
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

const adjustBooking = async (id: string, payload: Partial<IBooking>) => {
  const result = await prisma.$transaction(
    async (tx) => {
      const updateBooking = await tx.booking.update({
        where: {
          id,
        },
        data: {
          ...payload,
        },
        include: {
          service: {
            select: {
              serviceName: true,
            },
          },
        },
      });

      if (!updateBooking) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Booking has not been updated"
        );
      }

      // create notification
      await tx.notification.create({
        data: {
          userId: updateBooking.userId,
          content:
            "Your requested booking schedule for " +
            updateBooking.service.serviceName +
            " has been adjusted to " +
            updateBooking.startTime +
            " to " +
            updateBooking.endTime,
        },
      });

      return updateBooking;
    },
    {
      maxWait: 5000,
      timeout: 10000,
    }
  );

  return result;
};

const updateBookingStatus = async (
  id: string,
  payload: { bookingStatus: BookingStatus }
) => {
  const result = await prisma.$transaction(
    async (tx) => {
      const updateBookingStatus = await tx.booking.update({
        where: {
          id,
        },
        data: {
          bookingStatus: payload.bookingStatus,
        },
        include: {
          service: {
            select: {
              serviceName: true,
            },
          },
        },
      });

      if (!updateBookingStatus) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Booking Status has not been updated"
        );
      }

      // create notification
      await tx.notification.create({
        data: {
          userId: updateBookingStatus.userId,
          content:
            "Your requested booking schedule for " +
            updateBookingStatus.service.serviceName +
            " has been " +
            updateBookingStatus.bookingStatus,
        },
      });

      return updateBookingStatus;
    },
    {
      maxWait: 5000,
      timeout: 10000,
    }
  );

  return result;
};

const deleteBooking = async (id: string) => {
  const result = await prisma.booking.delete({
    where: {
      id,
    },
  });

  return result;
};

const getBookingCountsByInterval = async () => {
  const bookings = await prisma.booking.findMany({
    where: {
      //! filter can be added later
    },
    orderBy: { createdAt: "asc" },
  });

  const startDate = new Date("2024-10-01T00:00:00.000Z");
  const endDate = new Date();

  const totalDays = differenceInDays(endDate, startDate);
  const totalIntervals = Math.ceil(totalDays / 5);

  // Prepopulate groupedData with intervals and count 0
  const groupedData = Array.from({ length: totalIntervals }, (_, i) => ({
    dayCount: (i + 1) * 5,
    bookingCountInInterval: 0,
  }));

  for (let i = 0; i < bookings.length; i++) {
    const currentBooking = bookings[i];
    const daysSinceStart = differenceInDays(
      new Date(currentBooking.createdAt),
      startDate
    );
    const intervalIndex = Math.floor(daysSinceStart / 5);

    groupedData[intervalIndex].bookingCountInInterval += 1;
  }

  return groupedData;
};

export const BookingService = {
  createBooking,
  customerSpecificBookings,
  cancelBooking,
  getAllBookings,
  adjustBooking,
  updateBookingStatus,
  deleteBooking,
  getBookingCountsByInterval,
};
