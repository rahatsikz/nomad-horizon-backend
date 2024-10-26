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
    city: z.string({
      required_error: "City is required",
    }),
    country: z.string({
      required_error: "Country is required",
    }),
  }),
});

const update = z.object({
  body: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    date: z.string().datetime().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    showOnHomepage: z.boolean().optional(),
  }),
});

export const EventValidation = {
  create,
  update,
};
