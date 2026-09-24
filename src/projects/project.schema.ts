import { z } from "zod";

export const addMemberSchema = z.object({
  params: z.object({
    id: z.coerce
      .number({ message: "Project ID must be a number" })
      .int()
      .positive("Project ID must be positive"),
  }),
  body: z.object({
    userId: z
      .number({ message: "userId must be a number" })
      .int()
      .positive("userId must be positive"),
  }),
});

export type AddMemberInput = z.infer<typeof addMemberSchema>;
