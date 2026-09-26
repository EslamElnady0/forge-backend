import { Request, Response, NextFunction } from "express";
import { TaskService } from "./task.service";
import {
  CreateTaskInput,
  TaskIdParamInput,
  ProjectIdParamInput,
  AssigneeIdParamInput,
} from "./task.schema";

export class TaskController {
  constructor(private taskService: TaskService) {}

  createTask = async (
    req: Request<any, CreateTaskInput["body"], any>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { title, status, projectId, assigneeId } = req.body;

      const task = await this.taskService.createTask(
        title,
        status,
        projectId,
        assigneeId,
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

  getTask = async (
    req: Request<any, any, TaskIdParamInput["params"]>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;

      const task = await this.taskService.getTask(id);
      return res.status(200).json({ task });
    } catch (error) {
      next(error);
    }
  };

  getTasks = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const tasks = await this.taskService.getTasks();
      return res.status(200).json({ tasks });
    } catch (error) {
      next(error);
    }
  };

  getTasksByProject = async (
    req: Request<any, any, ProjectIdParamInput["params"]>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { projectId } = req.params;

      const tasks = await this.taskService.getTasksByProject(projectId);
      return res.status(200).json({ tasks });
    } catch (error) {
      next(error);
    }
  };

  getTasksByAssignee = async (
    req: Request<any, any, AssigneeIdParamInput["params"]>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;

      const tasks = await this.taskService.getTasksByAssignee(id);
      return res.status(200).json({ tasks });
    } catch (error) {
      next(error);
    }
  };
}
