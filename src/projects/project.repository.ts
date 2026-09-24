import { Prisma } from "../generated/prisma/client";
import { ProjectModel } from "../generated/prisma/models";
import { AppError } from "../utils/appError";
import { prisma, runDb } from "../utils/prisma";
import { CreateProjectRequest, Project } from "./project";

export class ProjectRepository {
  async save(projectReq: CreateProjectRequest): Promise<Project> {
    const result = await this.execute(() =>
      prisma.project.create({
        data: {
          title: projectReq.title,
          description: projectReq.description ?? null,
          ownerId: projectReq.ownerId,
        },
      }),
    );

    return new Project(
      result.id,
      result.title,
      result.description,
      result.ownerId,
    );
  }

  async findById(id: number): Promise<Project> {
    const result = await this.execute(() =>
      prisma.project.findUniqueOrThrow({ where: { id } }),
    );

    return new Project(
      result.id,
      result.title,
      result.description,
      result.ownerId,
    );
  }

  async fetchProjects(): Promise<Project[]> {
    const rawProjects: ProjectModel[] = await this.execute(() =>
      prisma.project.findMany(),
    );
    return rawProjects.map(
      (project) =>
        new Project(
          project.id,
          project.title,
          project.description,
          project.ownerId,
        ),
    );
  }

  private execute<T>(action: () => Promise<T>): Promise<T> {
    return runDb(action, (error: Prisma.PrismaClientKnownRequestError) => {
      switch (error.code) {
        case "P2003":
          throw new AppError("Owner not found.", 404);
        case "P2025":
          throw new AppError("Project not found.", 404);
      }
    });
  }
}
