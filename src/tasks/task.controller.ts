import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { TaskService } from "./task.service";
import { TaskStatus } from "./task";
import { AppError } from "../utils/appError";

const CreateTaskSchema = z.object({
  title: z.string().min(1, "title is required"),
  status: z.enum(TaskStatus),
  projectId: z.coerce.number().int().nonnegative(),
  assigneeId: z.coerce.number().int().nonnegative().optional(),
});

const IdSchema = z.coerce.number().int().nonnegative();

export class TaskController {
  constructor(private taskService: TaskService) {}

  createTask = async (req: Request, res: Response, next: NextFunction) => {
    const result = CreateTaskSchema.safeParse(req.body);

    if (!result.success) {
      const validationDetails = z.treeifyError(result.error).properties;
      return next(new AppError("Validation failed", 400, validationDetails));
    }

    try {
      const task = await this.taskService.createTask(
        result.data.title,
        result.data.status,
        result.data.projectId,
        result.data.assigneeId,
      );
      return res.status(201).json({
        id: task.id,
        title: task.title,
        status: task.status,
        projectId: task.projectId,
        assigneeId: task.assigneeId,
      });
    } catch (error) {
      next(error);
    }
  };

  getTask = async (req: Request, res: Response, next: NextFunction) => {
    const validationRes = IdSchema.safeParse(req.params.id);

    if (!validationRes.success) {
      const validationDetails = z.treeifyError(validationRes.error);
      return next(new AppError("Validation failed", 400, validationDetails));
    }

    try {
      const task = await this.taskService.getTask(validationRes.data);
      return res.status(200).json({ task });
    } catch (error) {
      next(error);
    }
  };

  getTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tasks = await this.taskService.getTasks();
      return res.status(200).json({ tasks });
    } catch (error) {
      next(error);
    }
  };

  getTasksByProject = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const validationRes = IdSchema.safeParse(req.params.projectId);

    if (!validationRes.success) {
      const validationDetails = z.treeifyError(validationRes.error);
      return next(new AppError("Validation failed", 400, validationDetails));
    }

    try {
      const projectId = validationRes.data;
      const tasks = await this.taskService.getTasksByProject(projectId);
      return res.status(200).json({ tasks });
    } catch (error) {
      next(error);
    }
  };

  getTasksByAssignee = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const validationRes = IdSchema.safeParse(req.params.assigneeId);

    if (!validationRes.success) {
      const validationDetails = z.treeifyError(validationRes.error);
      return next(new AppError("Validation failed", 400, validationDetails));
    }

    try {
      const assigneeId = validationRes.data;
      const tasks = await this.taskService.getTasksByAssignee(assigneeId);
      return res.status(200).json({ tasks });
    } catch (error) {
      next(error);
    }
  };
}
