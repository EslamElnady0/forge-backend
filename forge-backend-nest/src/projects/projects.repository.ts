import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project, ProjectMember } from './entities/project.entity';
import { Prisma } from '../generated/prisma/client';

@Injectable()
export class ProjectsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(dto: CreateProjectDto): Promise<Project> {
    const raw = await this.execute(() =>
      this.prisma.project.create({
        data: {
          title: dto.title,
          description: dto.description ?? null,
          ownerId: dto.ownerId,
          members: {
            connect: { id: dto.ownerId },
          },
        },
      }),
    );
    return new Project(raw.id, raw.title, raw.description, raw.ownerId);
  }

  async addMember(
    projectId: number,
    userId: number,
  ): Promise<{ message: string }> {
    const raw = await this.execute(() =>
      this.prisma.project.update({
        where: { id: projectId },
        data: {
          members: {
            connect: { id: userId },
          },
        },
      }),
    );
    return {
      message: `Member added successfully to the project ${raw.title}`,
    };
  }

  async fetchProjectMembers(projectId: number): Promise<ProjectMember[]> {
    const project = await this.execute(() =>
      this.prisma.project.findUniqueOrThrow({
        where: { id: projectId },
        include: { members: true },
      }),
    );

    return project.members.map(
      (member) => new ProjectMember(member.id, member.name, member.email),
    );
  }

  async findById(id: number): Promise<Project> {
    const raw = await this.execute(() =>
      this.prisma.project.findUniqueOrThrow({
        where: { id },
        include: { members: true },
      }),
    );
    return new Project(
      raw.id,
      raw.title,
      raw.description,
      raw.ownerId,
      raw.members,
    );
  }

  async fetchProjects(): Promise<Project[]> {
    const rawProjects = await this.execute(() =>
      this.prisma.project.findMany(),
    );
    return rawProjects.map(
      (p) => new Project(p.id, p.title, p.description, p.ownerId),
    );
  }

  async fetchUserProjects(userId: number): Promise<Project[]> {
    const rawProjects = await this.execute(() =>
      this.prisma.project.findMany({
        where: {
          OR: [{ ownerId: userId }, { members: { some: { id: userId } } }],
        },
      }),
    );
    return rawProjects.map(
      (p) => new Project(p.id, p.title, p.description, p.ownerId),
    );
  }

  async isUserMemberOrOwner(
    projectId: number,
    userId: number,
  ): Promise<boolean> {
    const count = await this.prisma.project.count({
      where: {
        id: projectId,
        OR: [{ ownerId: userId }, { members: { some: { id: userId } } }],
      },
    });
    return count > 0;
  }

  private async execute<T>(action: () => Promise<T>): Promise<T> {
    try {
      return await action();
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientInitializationError ||
        error instanceof Prisma.PrismaClientRustPanicError
      ) {
        throw new ServiceUnavailableException(
          'Database service is currently unreachable.',
        );
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2003':
            throw new NotFoundException('Owner or user not found.');
          case 'P2025':
            throw new NotFoundException('Project not found.');
        }
      }

      throw error;
    }
  }
}
