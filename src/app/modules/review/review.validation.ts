import { z } from "zod";

const create = z.object({
  body: z.object({
    content: z.string({
      required_error: "Content is required",
    }),
    rating: z.number({
      required_error: "Rating is required",
    }),

    bookingId: z.string({
      required_error: "Booking id is required",
    }),
  }),
});

export const ReviewValidation = {
  create,
};
