import prisma from "../../../shared/prisma";

const createEvent = async (payload: any) => {
  const result = await prisma.event.create({
    data: payload,
  });

  return result;
};

const getAllEvents = async (filters: { showOnHomepage?: boolean }) => {
  const result = await prisma.event.findMany({
    orderBy: {
      createdAt: "asc",
    },
    where: {
      showOnHomepage: filters.showOnHomepage && Boolean(filters.showOnHomepage),
    },
  });
  return result;
};

const getEventById = async (id: string) => {
  const result = await prisma.event.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const deleteEvent = async (id: string) => {
  const result = await prisma.event.delete({
    where: {
      id,
    },
  });
  return result;
};

const updateEvent = async (id: string, payload: any) => {
  const result = await prisma.event.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

export const EventService = {
  createEvent,
  getAllEvents,
  getEventById,
  deleteEvent,
  updateEvent,
};
