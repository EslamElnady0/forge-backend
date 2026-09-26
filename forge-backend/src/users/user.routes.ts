import { Router } from "express";
import {
  userController,
  taskController,
  projectController,
} from "../container";
import { validate } from "../middlewares/validate";
import { CreateUserSchema, UserIdParamSchema } from "./user.schema";
import { AssigneeIdParamSchema } from "../tasks/task.schema";

const userRouter = Router();

userRouter.get("/", userController.getUsers);

userRouter.post("/", validate(CreateUserSchema), userController.createUser);

userRouter.get("/:id", validate(UserIdParamSchema), userController.getUser);

// Nested resource: tasks assigned to a specific user
userRouter.get(
  "/:id/tasks",
  validate(AssigneeIdParamSchema),
  taskController.getTasksByAssignee,
);

// Nested resource: projects belonging to a user
userRouter.get(
  "/:id/projects",
  validate(UserIdParamSchema),
  projectController.getUserProjects,
);

export default userRouter;
