import { z } from "zod";

// Schema for routes with /:id parameter
export const ProjectIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().nonnegative(),
  }),
});

// Schema for POST /projects
export const CreateProjectSchema = z.object({
  body: z.object({
    title: z.string().min(1, "title is required"),
    description: z.string().optional(),
    ownerId: z.coerce.number().int().nonnegative(),
  }),
});

// Schema for PATCH /projects/:id (combines params + body)
export const AddMemberSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().nonnegative(),
  }),
  body: z.object({
    userId: z.coerce.number().int().nonnegative(),
  }),
});

// Inferred types for controller typing
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type ProjectIdParamInput = z.infer<typeof ProjectIdParamSchema>;
export type AddMemberInput = z.infer<typeof AddMemberSchema>;
