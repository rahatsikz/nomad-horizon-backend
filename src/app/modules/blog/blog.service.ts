import prisma from "../../../shared/prisma";

const createBlog = async (payload: any) => {
  const result = await prisma.blog.create({
    data: payload,
  });

  return result;
};

export const BlogService = {
  createBlog,
};
