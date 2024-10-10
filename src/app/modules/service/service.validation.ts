import { z } from "zod";

const create = z.object({
  body: z.object({
    serviceName: z.string({
      required_error: "Service name is required",
    }),
    content: z.string({
      required_error: "Service Content is required",
    }),
    price: z.number({
      required_error: "Service price is required",
    }),
    category: z.enum(["technical", "lifestyle"], {
      required_error: "Service category is required",
    }),
    status: z.enum(["available", "upcoming"], {
      required_error: "Service status is required",
    }),
    image: z.string({
      required_error: "Service image is required",
    }),
  }),
});

export const ServiceValidation = {
  create,
};
