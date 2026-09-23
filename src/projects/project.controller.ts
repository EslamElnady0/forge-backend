import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ProjectService } from "./project.service";

const CreateProjectSchema = z.object({
  title: z.string().min(1, "title is required"),
  description: z.string().optional(),
  ownerId: z.coerce.number().int().nonnegative(),
});

const ProjectIdSchema = z.coerce.number().int().nonnegative();

export class ProjectController {
  constructor(private projectService: ProjectService) {}

  createProject = (req: Request, res: Response, next: NextFunction) => {
    const result = CreateProjectSchema.safeParse(req.body);

    if (!result.success) {
      return res
        .status(400)
        .json({ properties: z.treeifyError(result.error).properties });
    }

    try {
      const p = this.projectService.createProject(
        result.data.title,
        result.data.description ?? "",
        result.data.ownerId,
      );
      return res.status(201).json({
        id: p.id,
        title: p.title,
        description: p.description,
        ownerId: p.ownerId,
      });
    } catch (error) {
      next(error);
    }
  };

  getProject = (req: Request, res: Response, next: NextFunction) => {
    const validationRes = ProjectIdSchema.safeParse(req.params.id);

    if (!validationRes.success) {
      return res.status(400).json(z.treeifyError(validationRes.error));
    }

    try {
      const project = this.projectService.getProject(validationRes.data);
      return res.status(200).json({ project });
    } catch (error) {
      next(error);
    }
  };

  getProjects = (req: Request, res: Response, next: NextFunction) => {
    try {
      const projects = this.projectService.getProjects();
      return res.status(200).json({ projects });
    } catch (error) {
      next(error);
    }
  };
}
