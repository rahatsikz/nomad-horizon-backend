import { z } from "zod";

const create = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    content: z.string({
      required_error: "Content is required",
    }),
    date: z
      .string({
        required_error: "Date is required",
      })
      .datetime(),
  }),
});

const update = z.object({
  body: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    date: z.string().datetime().optional(),
    showOnHomepage: z.boolean().optional(),
  }),
});

export const NewsValidation = {
  create,
  update,
};
