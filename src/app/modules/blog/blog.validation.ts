import { z } from "zod";

const create = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    content: z.string({
      required_error: "Content is required",
    }),
    author: z.string({
      required_error: "Author is required",
    }),
    image: z.string({
      required_error: "Image is required",
    }),
  }),
});

export const BlogValidation = {
  create,
};
