import { Router } from "express";
import { taskController } from "../container";
import { validate } from "../middlewares/validate";
import {
  CreateTaskSchema,
  TaskIdParamSchema,
  ProjectIdParamSchema,
  AssigneeIdParamSchema,
} from "./task.schema";

const taskRouter = Router();

taskRouter.get("/", taskController.getTasks);
taskRouter.post("/", validate(CreateTaskSchema), taskController.createTask);
taskRouter.get("/:id", validate(TaskIdParamSchema), taskController.getTask);
taskRouter.get(
  "/project/:projectId",
  validate(ProjectIdParamSchema),
  taskController.getTasksByProject,
);
taskRouter.get(
  "/assignee/:assigneeId",
  validate(AssigneeIdParamSchema),
  taskController.getTasksByAssignee,
);

export default taskRouter;
