import prisma from "../../src/shared/prisma";

export const assertTestDatabase = () => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl?.includes("test")) {
    throw new Error(
      "DATABASE_URL must point to a dedicated test database whose name includes 'test'"
    );
  }
};

export const resetTestDatabase = async () => {
  assertTestDatabase();

  await prisma.$transaction([
    prisma.review.deleteMany(),
    prisma.booking.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.feedback.deleteMany(),
    prisma.schedule.deleteMany(),
    prisma.service.deleteMany(),
    prisma.blog.deleteMany(),
    prisma.event.deleteMany(),
    prisma.news.deleteMany(),
    prisma.user.deleteMany(),
  ]);
};

export const disconnectTestDatabase = async () => {
  await prisma.$disconnect();
};

export { prisma };