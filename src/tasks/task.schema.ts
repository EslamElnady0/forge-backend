import { z } from "zod";
import { TaskStatus } from "./task";

export const CreateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, "title is required"),
    status: z.enum(
      TaskStatus,
      "invalid state, use TODO, IN_PROGRESS, DONE only",
    ),
    projectId: z.coerce.number().int().nonnegative(),
    assigneeId: z.coerce.number().int().nonnegative().nullable().optional(),
  }),
});

export const TaskIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().nonnegative(),
  }),
});

export const ProjectIdParamSchema = z.object({
  params: z.object({
    projectId: z.coerce.number().int().nonnegative(),
  }),
});

export const AssigneeIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().nonnegative(),
  }),
});

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type TaskIdParamInput = z.infer<typeof TaskIdParamSchema>;
export type ProjectIdParamInput = z.infer<typeof ProjectIdParamSchema>;
export type AssigneeIdParamInput = z.infer<typeof AssigneeIdParamSchema>;
