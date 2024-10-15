import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";
import { IBooking } from "./booking.interface";

const createBooking = async (payload: IBooking, userId: string) => {
  const result = await prisma.$transaction(
    async (tx) => {
      const newBooking = await tx.booking.create({
        data: {
          ...payload,
          userId,
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
            "We got your booking request. Once it is approved, we will notify you.",
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

export const BookingService = {
  createBooking,
};
