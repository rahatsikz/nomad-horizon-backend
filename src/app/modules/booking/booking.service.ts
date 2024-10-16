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

export const BookingService = {
  createBooking,
  customerSpecificBookings,
  cancelBooking,
};
