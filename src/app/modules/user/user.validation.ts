import { z } from "zod";

const create = z.object({
  body: z.object({
    username: z.string({
      required_error: "Username is required",
    }),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email(),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6)
      .max(20),
    role: z.enum(["customer", "admin", "superadmin"]).optional(),
  }),
});

const update = z.object({
  body: z.object({
    username: z.string().optional(),
    address: z.string().optional(),
    contactNo: z.string().optional(),
  }),
});

export const UserValidation = {
  create,
  update,
};
