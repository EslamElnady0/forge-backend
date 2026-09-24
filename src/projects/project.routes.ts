import { Router } from "express";
import { projectController, taskController } from "../container";
import { validate } from "../middlewares/validate";
import { addMemberSchema } from "./project.schema";

const projectRouter = Router();

projectRouter.get("/", projectController.getProjects);
projectRouter.post("/", projectController.createProject);
projectRouter.get("/:id", projectController.getProject);
projectRouter.patch(
  "/:id",
  validate(addMemberSchema),
  projectController.addMemberToProject,
);
projectRouter.get("/:id/members", projectController.getProjectMembers);

projectRouter.get("/:projectId/tasks", taskController.getTasksByProject);

export default projectRouter;
