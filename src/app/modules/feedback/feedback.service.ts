import prisma from "../../../shared/prisma";

const createFeedback = async (content: string, userId: string) => {
  const result = await prisma.feedback.create({
    data: {
      content,
      userId,
    },
  });

  return result;
};

const getAllFeedbacks = async () => {
  const result = await prisma.feedback.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        include: {
          bookings: true,
        },
      },
    },
  });

  return result;
};

export const FeedbackService = {
  createFeedback,
  getAllFeedbacks,
};
