import { z } from "zod";

const create = z.object({
  body: z.object({
    content: z.string({
      required_error: "Content is required",
    }),
  }),
});

export const FeedbackValidation = {
  create,
};
