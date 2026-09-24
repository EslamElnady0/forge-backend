import { z } from "zod";

export const CreateUserSchema = z.object({
  body: z.object({
    name: z.string().min(1, "name is required"),
    email: z.string().email("email must be valid"),
  }),
});

export const UserIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().nonnegative(),
  }),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UserIdParamInput = z.infer<typeof UserIdParamSchema>;
