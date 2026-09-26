import { Request, Response, NextFunction } from "express";
import { ProjectService } from "./project.service";
import {
  CreateProjectInput,
  ProjectIdParamInput,
  AddMemberInput,
} from "./project.schema";

export class ProjectController {
  constructor(private projectService: ProjectService) {}

  createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, description, ownerId } =
        req.body as CreateProjectInput["body"];

      const project = await this.projectService.createProject(
        title,
        description,
        ownerId,
      );

      return res.status(201).json({
        id: project.id,
        title: project.title,
        description: project.description,
        ownerId: project.ownerId,
      });
    } catch (error) {
      next(error);
    }
  };

  getProject = async (
    req: Request<any, any, ProjectIdParamInput["params"]>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;

      const project = await this.projectService.getProject(id);
      return res.status(200).json({ project });
    } catch (error) {
      next(error);
    }
  };

  addMemberToProject = async (
    req: Request<any, AddMemberInput["params"], AddMemberInput["body"]>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      const updatedProjectMessage =
        await this.projectService.addMemberToProject(id, userId);

      return res.status(200).json({
        success: true,
        data: updatedProjectMessage,
      });
    } catch (error) {
      next(error);
    }
  };

  getProjectMembers = async (
    req: Request<any, any, ProjectIdParamInput["params"]>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;

      const projectMembers = await this.projectService.getProjectMembers(id);
      return res.status(200).json({ projectMembers });
    } catch (error) {
      next(error);
    }
  };

  getProjects = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const projects = await this.projectService.getProjects();
      return res.status(200).json({ projects });
    } catch (error) {
      next(error);
    }
  };

  getUserProjects = async (
    req: Request<any, any, ProjectIdParamInput["params"]>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;

      const projects = await this.projectService.getUserProjects(id);
      return res.status(200).json({ projects });
    } catch (error) {
      next(error);
    }
  };
}
