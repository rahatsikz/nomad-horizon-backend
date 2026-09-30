import httpStatus from "http-status";
import { BookingStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";

type CreateReviewInput = {
  content: string;
  rating: number;
  bookingId: string;
};

const createReview = async (payload: CreateReviewInput, userId: string) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: payload.bookingId,
      userId,
    },
  });

  if (!booking) {
    throw new ApiError(httpStatus.NOT_FOUND, "Booking not found");
  }

  if (booking.bookingStatus !== BookingStatus.completed) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Only completed bookings can be reviewed",
    );
  }

  const existingReview = await prisma.review.findFirst({
    where: {
      bookingId: booking.id,
      userId,
    },
  });

  if (existingReview) {
    throw new ApiError(httpStatus.CONFLICT, "This booking has already been reviewed");
  }

  const result = await prisma.review.create({
    data: {
      content: payload.content,
      rating: payload.rating,
      bookingId: booking.id,
      userId,
      serviceId: booking.serviceId,
    },
  });

  return result;
};

const getAllReviews = async (filters: {
  serviceId?: string;
  bookingId?: string;
}) => {
  const allConditions = [];

  if (Object.keys(filters).length > 0) {
    allConditions.push({
      AND: Object.entries(filters).map(([key, value]) => ({
        [key]: value,
      })),
    });
  }

  const whereCondition = allConditions.length > 0 ? { AND: allConditions } : {};

  const result = await prisma.review.findMany({
    where: whereCondition,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
  return result;
};

export const ReviewService = {
  createReview,
  getAllReviews,
};
