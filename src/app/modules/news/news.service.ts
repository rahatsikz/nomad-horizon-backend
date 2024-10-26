import prisma from "../../../shared/prisma";

const createNews = async (payload: any) => {
  const result = await prisma.news.create({
    data: payload,
  });

  return result;
};

const getAllNews = async (filters: { showOnHomepage?: boolean }) => {
  const result = await prisma.news.findMany({
    where: {
      showOnHomepage: filters.showOnHomepage && Boolean(filters.showOnHomepage),
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  return result;
};

const getNewsById = async (id: string) => {
  const result = await prisma.news.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateNews = async (id: string, payload: any) => {
  const result = await prisma.news.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteNews = async (id: string) => {
  const result = await prisma.news.delete({
    where: {
      id,
    },
  });
  return result;
};

export const NewsService = {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
};
