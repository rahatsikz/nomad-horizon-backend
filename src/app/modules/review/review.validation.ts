import { z } from "zod";

const create = z.object({
  body: z
    .object({
      content: z
        .string({
          required_error: "Content is required",
        })
        .trim()
        .min(5)
        .max(2000),
      rating: z
        .number({
          required_error: "Rating is required",
        })
        .int()
        .min(1)
        .max(5),
      bookingId: z.string({
        required_error: "Booking id is required",
      }).uuid(),
    })
    .strict(),
});

const getAll = z.object({
  query: z.object({
    serviceId: z.string().uuid().optional(),
    bookingId: z.string().uuid().optional(),
  }),
});

export const ReviewValidation = {
  create,
  getAll,
};
