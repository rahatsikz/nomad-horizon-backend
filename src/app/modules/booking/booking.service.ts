import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";
import { IBooking } from "./booking.interface";
import { BookingStatus } from "@prisma/client";

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

const getAllBookings = async (bookingStatus: BookingStatus) => {
  const result = await prisma.booking.findMany({
    where: {
      bookingStatus: bookingStatus ? bookingStatus : undefined,
    },
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

  return result;
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

export const BookingService = {
  createBooking,
  customerSpecificBookings,
  cancelBooking,
  getAllBookings,
  adjustBooking,
  updateBookingStatus,
  deleteBooking,
};
