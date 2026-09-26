import { Prisma } from "../generated/prisma/client";
import { ProjectModel, UserModel } from "../generated/prisma/models";
import { AppError } from "../utils/appError";
import { prisma, runDb } from "../utils/prisma";
import {
  addMemberToProjectResponse,
  CreateProjectRequest,
  Project,
  ProjectMemberResponse,
} from "./project";

export class ProjectRepository {
  async save(projectReq: CreateProjectRequest): Promise<Project> {
    const result = await this.execute(() =>
      prisma.project.create({
        data: {
          title: projectReq.title,
          description: projectReq.description ?? null,
          ownerId: projectReq.ownerId,
          members: {
            connect: { id: projectReq.ownerId },
          },
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
  async addMember(
    projectId: number,
    userId: number,
  ): Promise<addMemberToProjectResponse> {
    const result = await this.execute(() =>
      prisma.project.update({
        where: { id: projectId },
        data: {
          members: {
            connect: { id: userId },
          },
        },
      }),
    );

    return new addMemberToProjectResponse(
      `Member added successfully to the project ${result.title}`,
    );
  }

  async fetchProjectMembers(
    projectId: number,
  ): Promise<ProjectMemberResponse[]> {
    const project = await this.execute(() =>
      prisma.project.findUniqueOrThrow({
        where: { id: projectId },
        include: { members: true, owner: true },
      }),
    );

    return project.members.map(
      (member) =>
        new ProjectMemberResponse(member.id, member.name, member.email),
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

  async fetchUserProjects(userId: number): Promise<Project[]> {
    const rawProjects: ProjectModel[] = await this.execute(() =>
      prisma.project.findMany({
        where: {
          OR: [{ ownerId: userId }, { members: { some: { id: userId } } }],
        },
      }),
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

  async isUserMemberOrOwner(
    projectId: number,
    userId: number,
  ): Promise<boolean> {
    const count = await prisma.project.count({
      where: {
        id: projectId,
        OR: [{ ownerId: userId }, { members: { some: { id: userId } } }],
      },
    });

    return count > 0;
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
