import { Router } from "express";
import { projectController, taskController } from "../container";
import { validate } from "../middlewares/validate";
import {
  CreateProjectSchema,
  ProjectIdParamSchema,
  AddMemberSchema,
} from "./project.schema";

const projectRouter = Router();

projectRouter.get("/", projectController.getProjects);

projectRouter.post(
  "/",
  validate(CreateProjectSchema),
  projectController.createProject,
);

projectRouter.get(
  "/:id",
  validate(ProjectIdParamSchema),
  projectController.getProject,
);

projectRouter.patch(
  "/:id",
  validate(AddMemberSchema),
  projectController.addMemberToProject,
);

projectRouter.get(
  "/:id/members",
  validate(ProjectIdParamSchema),
  projectController.getProjectMembers,
);

projectRouter.get("/:projectId/tasks", taskController.getTasksByProject);

export default projectRouter;
