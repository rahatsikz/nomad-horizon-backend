import prisma from "../../../shared/prisma";

const getNotificationsByID = async (userId: string) => {
  const result = await prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

export const NotificationService = {
  getNotificationsByID,
};
