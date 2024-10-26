import { undefined } from "zod";
import prisma from "../../../shared/prisma";

const createBlog = async (payload: any) => {
  const result = await prisma.blog.create({
    data: payload,
  });

  return result;
};

const getAllBlogs = async (filters: { showOnHomepage?: boolean }) => {
  const result = await prisma.blog.findMany({
    orderBy: {
      createdAt: "asc",
    },
    where: {
      showOnHomepage: filters.showOnHomepage && Boolean(filters.showOnHomepage),
    },
  });
  return result;
};

const getBlogById = async (id: string) => {
  const result = await prisma.blog.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateBlog = async (id: string, payload: any) => {
  const result = await prisma.blog.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteBlog = async (id: string) => {
  const result = await prisma.blog.delete({
    where: {
      id,
    },
  });
  return result;
};

export const BlogService = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
