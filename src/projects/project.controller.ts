import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ProjectService } from "./project.service";
import { AppError } from "../utils/appError";

const CreateProjectSchema = z.object({
  title: z.string().min(1, "title is required"),
  description: z.string().optional(),
  ownerId: z.coerce.number().int().nonnegative(),
});

const ProjectIdSchema = z.coerce.number().int().nonnegative();

const AddMemberSchema = z.object({
  projId: z.coerce.number().int().nonnegative(),
  userId: z.coerce.number().int().nonnegative(),
});
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  createProject = async (req: Request, res: Response, next: NextFunction) => {
    const result = CreateProjectSchema.safeParse(req.body);

    if (!result.success) {
      const validationDetails = z.treeifyError(result.error).properties;
      return next(new AppError("Validation failed", 400, validationDetails));
    }

    try {
      const p = this.projectService.createProject(
        result.data.title,
        result.data.description,
        result.data.ownerId,
      );
      const project = await p;
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

  getProject = async (req: Request, res: Response, next: NextFunction) => {
    const validationRes = ProjectIdSchema.safeParse(req.params.id);

    if (!validationRes.success) {
      const validationDetails = z.treeifyError(validationRes.error);

      return next(new AppError("Validation failed", 400, validationDetails));
    }
    try {
      const project = await this.projectService.getProject(validationRes.data);
      return res.status(200).json({ project });
    } catch (error) {
      next(error);
    }
  };

  addMemberToProject = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const projectId = req.params.id as unknown as number;
      const { userId } = req.body;

      const updatedProjectMessage =
        await this.projectService.addMemberToProject(projectId, userId);

      return res.status(200).json({
        success: true,
        data: updatedProjectMessage,
      });
    } catch (error) {
      next(error);
    }
  };
  getProjectMembers = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const validationRes = ProjectIdSchema.safeParse(req.params.id);

    if (!validationRes.success) {
      const validationDetails = z.treeifyError(validationRes.error);

      return next(new AppError("Validation failed", 400, validationDetails));
    }
    try {
      const projectMembers = await this.projectService.getProjectMembers(
        validationRes.data,
      );
      return res.status(200).json({ projectMembers });
    } catch (error) {
      next(error);
    }
  };
  getProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projects = await this.projectService.getProjects();
      return res.status(200).json({ projects });
    } catch (error) {
      next(error);
    }
  };

  getUserProjects = async (req: Request, res: Response, next: NextFunction) => {
    const validationRes = ProjectIdSchema.safeParse(req.params.id);

    if (!validationRes.success) {
      const validationDetails = z.treeifyError(validationRes.error);
      return next(new AppError("Validation failed", 400, validationDetails));
    }

    try {
      const projects = await this.projectService.getUserProjects(
        validationRes.data,
      );
      return res.status(200).json({ projects });
    } catch (error) {
      next(error);
    }
  };
}
