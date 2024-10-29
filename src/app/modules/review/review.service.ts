import { Review } from "@prisma/client";
import prisma from "../../../shared/prisma";

const createReview = async (payload: Review, userId: string) => {
  const isBookingExists = await prisma.booking.findUnique({
    where: {
      id: payload.bookingId,
    },
  });

  if (!isBookingExists) {
    throw new Error("Service not found");
  }

  const result = await prisma.review.create({
    data: {
      ...payload,
      userId,
      serviceId: isBookingExists.serviceId,
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
      user: true,
    },
  });
  return result;
};

export const ReviewService = {
  createReview,
  getAllReviews,
};
