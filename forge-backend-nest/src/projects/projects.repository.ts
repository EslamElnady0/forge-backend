import {
  ConflictException,
  ForbiddenException,
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

  private getAccessFilter(
    userId: number,
    isAdmin: boolean,
  ): Prisma.ProjectWhereInput {
    if (isAdmin) return {};

    return {
      OR: [{ ownerId: userId }, { members: { some: { id: userId } } }],
    };
  }

  async save(dto: CreateProjectDto & { ownerId: number }): Promise<Project> {
    return this.execute(async () => {
      const raw = await this.prisma.project.create({
        data: {
          title: dto.title,
          description: dto.description,
          ownerId: dto.ownerId,
        },
      });

      return new Project(raw.id, raw.title, raw.description, raw.ownerId);
    });
  }

  async findAllScoped(userId: number, isAdmin: boolean): Promise<Project[]> {
    return this.execute(async () => {
      const records = await this.prisma.project.findMany({
        where: this.getAccessFilter(userId, isAdmin),
      });

      return records.map(
        (p) => new Project(p.id, p.title, p.description, p.ownerId),
      );
    });
  }

  async findByIdScoped(
    id: number,
    userId: number,
    isAdmin: boolean,
    includeMembers = false,
  ): Promise<Project | null> {
    return this.execute(async () => {
      const raw = await this.prisma.project.findFirst({
        where: {
          id,
          ...this.getAccessFilter(userId, isAdmin),
        },
        include: {
          members: includeMembers,
        },
      });

      if (!raw) return null;

      const members = raw.members?.map(
        (m) => new ProjectMember(m.id, m.name, m.email),
      );

      return new Project(
        raw.id,
        raw.title,
        raw.description,
        raw.ownerId,
        members,
      );
    });
  }

  async addMember(
    projectId: number,
    newMemberId: number,
    callerUserId: number,
    isAdmin: boolean,
  ): Promise<void> {
    return this.execute(async () => {
      const project = await this.prisma.project.findFirst({
        where: {
          id: projectId,
          ...(isAdmin ? {} : { ownerId: callerUserId }),
        },
      });

      if (!project) {
        throw new ForbiddenException(
          'Project not found or you are not the owner authorized to add members.',
        );
      }

      await this.prisma.project.update({
        where: { id: projectId },
        data: {
          members: {
            connect: { id: newMemberId },
          },
        },
      });
    });
  }

  async deleteScoped(
    id: number,
    callerUserId: number,
    isAdmin: boolean,
  ): Promise<boolean> {
    return this.execute(async () => {
      const result = await this.prisma.project.deleteMany({
        where: {
          id,
          ...(isAdmin ? {} : { ownerId: callerUserId }),
        },
      });

      return result.count > 0;
    });
  }

  private async execute<T>(action: () => Promise<T>): Promise<T> {
    try {
      return await action();
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientInitializationError ||
        error instanceof Prisma.PrismaClientRustPanicError
      ) {
        throw new ServiceUnavailableException('Database service unreachable.');
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Referenced record does not exist.');
        }
      }

      throw error;
    }
  }
}
