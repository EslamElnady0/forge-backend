import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskStatus } from './entities/task.entity';
import { Prisma } from '../generated/prisma/client';

@Injectable()
export class TasksRepository {
  constructor(private readonly prisma: PrismaService) {}

  private getAccessFilter(
    userId: number,
    isAdmin: boolean,
  ): Prisma.TaskWhereInput {
    if (isAdmin) return {};

    return {
      project: {
        OR: [{ ownerId: userId }, { members: { some: { id: userId } } }],
      },
    };
  }

  async save(
    dto: CreateTaskDto,
    userId: number,
    isAdmin: boolean,
  ): Promise<Task> {
    return this.execute(async () => {
      if (!isAdmin) {
        const canAccess = await this.prisma.project.count({
          where: {
            id: dto.projectId,
            OR: [{ ownerId: userId }, { members: { some: { id: userId } } }],
          },
        });

        if (canAccess === 0) {
          throw new ForbiddenException(
            'You do not have permission to add tasks to this project.',
          );
        }
      }

      const raw = await this.prisma.task.create({
        data: {
          title: dto.title,
          status: dto.status,
          projectId: dto.projectId,
          assigneeId: dto.assigneeId,
        },
      });

      return new Task(
        raw.id,
        raw.title,
        raw.status as TaskStatus,
        raw.projectId,
        raw.assigneeId,
      );
    });
  }

  async findByIdScoped(
    id: number,
    userId: number,
    isAdmin: boolean,
  ): Promise<Task> {
    return this.execute(async () => {
      const raw = await this.prisma.task.findFirst({
        where: {
          id,
          ...this.getAccessFilter(userId, isAdmin),
        },
      });

      if (!raw) {
        throw new NotFoundException(
          `Task with ID ${id} not found or access denied.`,
        );
      }

      return new Task(
        raw.id,
        raw.title,
        raw.status as TaskStatus,
        raw.projectId,
        raw.assigneeId,
      );
    });
  }

  async updateScoped(
    id: number,
    dto: UpdateTaskDto,
    userId: number,
    isAdmin: boolean,
  ): Promise<Task> {
    return this.execute(async () => {
      const result = await this.prisma.task.updateMany({
        where: {
          id,
          ...this.getAccessFilter(userId, isAdmin),
        },
        data: dto,
      });

      if (result.count === 0) {
        throw new NotFoundException(
          `Task with ID ${id} not found or access denied.`,
        );
      }

      const raw = await this.prisma.task.findUniqueOrThrow({
        where: { id },
      });

      return new Task(
        raw.id,
        raw.title,
        raw.status as TaskStatus,
        raw.projectId,
        raw.assigneeId,
      );
    });
  }

  async deleteScoped(
    id: number,
    userId: number,
    isAdmin: boolean,
  ): Promise<void> {
    return this.execute(async () => {
      const result = await this.prisma.task.deleteMany({
        where: {
          id,
          ...this.getAccessFilter(userId, isAdmin),
        },
      });

      if (result.count === 0) {
        throw new NotFoundException(
          `Task with ID ${id} not found or access denied.`,
        );
      }
    });
  }

  async findAllScoped(userId: number, isAdmin: boolean): Promise<Task[]> {
    return this.execute(async () => {
      const records = await this.prisma.task.findMany({
        where: this.getAccessFilter(userId, isAdmin),
      });

      return records.map(
        (t) =>
          new Task(
            t.id,
            t.title,
            t.status as TaskStatus,
            t.projectId,
            t.assigneeId,
          ),
      );
    });
  }

  async findByProjectScoped(
    projectId: number,
    userId: number,
    isAdmin: boolean,
  ): Promise<Task[]> {
    return this.execute(async () => {
      const records = await this.prisma.task.findMany({
        where: {
          projectId,
          ...this.getAccessFilter(userId, isAdmin),
        },
      });

      return records.map(
        (t) =>
          new Task(
            t.id,
            t.title,
            t.status as TaskStatus,
            t.projectId,
            t.assigneeId,
          ),
      );
    });
  }

  async findByAssigneeScoped(
    assigneeId: number,
    userId: number,
    isAdmin: boolean,
  ): Promise<Task[]> {
    return this.execute(async () => {
      const records = await this.prisma.task.findMany({
        where: {
          assigneeId,
          ...this.getAccessFilter(userId, isAdmin),
        },
      });

      return records.map(
        (t) =>
          new Task(
            t.id,
            t.title,
            t.status as TaskStatus,
            t.projectId,
            t.assigneeId,
          ),
      );
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
        if (error.code === 'P2003') {
          throw new NotFoundException(
            'Referenced project or assignee does not exist.',
          );
        }
      }

      throw error;
    }
  }
}
