import { z } from "zod";

const availability = z.object({
  query: z.object({
    serviceId: z.string().uuid({ message: "Service id is required" }),
    date: z.coerce.date({ message: "Date is required" }),
  }),
});

export const ScheduleValidation = {
  availability,
};