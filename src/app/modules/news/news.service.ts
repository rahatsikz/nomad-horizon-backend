import prisma from "../../../shared/prisma";

const createNews = async (payload: any) => {
  const result = await prisma.news.create({
    data: payload,
  });

  return result;
};

export const NewsService = {
  createNews,
};
