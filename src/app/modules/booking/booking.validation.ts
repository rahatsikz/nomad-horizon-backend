import { z } from "zod";

const create = z.object({
  body: z.object({
    serviceId: z.string({
      required_error: "Service id is required",
    }),
    date: z
      .string({
        required_error: "Date is required",
      })
      .datetime(),
    startTime: z.string({
      required_error: "Start time is required",
    }),
    endTime: z.string({
      required_error: "End time is required",
    }),
  }),
});

export const BookingValidation = {
  create,
};
