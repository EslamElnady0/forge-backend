import { Router } from "express";
import {
  userController,
  taskController,
  projectController,
} from "../container";

const userRouter = Router();

userRouter.get("/", userController.getUsers);
userRouter.post("/", userController.createUser);
userRouter.get("/:id", userController.getUser);

// Nested resource: tasks assigned to a specific user
userRouter.get("/:assigneeId/tasks", taskController.getTasksByAssignee);
userRouter.get("/:id/projects", projectController.getUserProjects);

export default userRouter;
