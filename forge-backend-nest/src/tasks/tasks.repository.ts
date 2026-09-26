import {
  BadRequestException,
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

  async save(dto: CreateTaskDto): Promise<Task> {
    const raw = await this.execute(() =>
      this.prisma.task.create({
        data: {
          title: dto.title,
          status: dto.status,
          projectId: dto.projectId,
          assigneeId: dto.assigneeId ?? null,
        },
      }),
    );
    return this.toEntity(raw);
  }

  async findById(id: number): Promise<Task> {
    const raw = await this.execute(() =>
      this.prisma.task.findUniqueOrThrow({ where: { id } }),
    );
    return this.toEntity(raw);
  }

  async fetchTasks(): Promise<Task[]> {
    const rawTasks = await this.execute(() => this.prisma.task.findMany());
    return rawTasks.map((t) => this.toEntity(t));
  }

  async findByProjectId(projectId: number): Promise<Task[]> {
    const rawTasks = await this.execute(() =>
      this.prisma.task.findMany({ where: { projectId } }),
    );
    return rawTasks.map((t) => this.toEntity(t));
  }

  async findByAssigneeId(assigneeId: number): Promise<Task[]> {
    const rawTasks = await this.execute(() =>
      this.prisma.task.findMany({ where: { assigneeId } }),
    );
    return rawTasks.map((t) => this.toEntity(t));
  }

  async update(id: number, dto: UpdateTaskDto): Promise<Task> {
    const raw = await this.execute(() =>
      this.prisma.task.update({
        where: { id },
        data: {
          ...(dto.title && { title: dto.title }),
          ...(dto.status && { status: dto.status }),
          ...(dto.projectId && { projectId: dto.projectId }),
          ...(dto.assigneeId !== undefined && { assigneeId: dto.assigneeId }),
        },
      }),
    );
    return this.toEntity(raw);
  }

  async delete(id: number): Promise<Task> {
    const raw = await this.execute(() =>
      this.prisma.task.delete({ where: { id } }),
    );
    return this.toEntity(raw);
  }

  private toEntity(raw: any): Task {
    return new Task(
      raw.id,
      raw.title,
      raw.status as TaskStatus,
      raw.projectId,
      raw.assigneeId,
    );
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
          case 'P2025':
            throw new NotFoundException('Task not found.');
          case 'P2003':
            throw new BadRequestException(
              'Referenced relation does not exist.',
            );
        }
      }

      throw error;
    }
  }
}
