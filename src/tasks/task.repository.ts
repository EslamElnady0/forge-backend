import { join } from "./../generated/prisma/internal/prismaNamespace";
import { Prisma } from "../generated/prisma/client";
import { TaskModel } from "../generated/prisma/models";
import { AppError } from "../utils/appError";
import { prisma, runDb } from "../utils/prisma";
import { CreateTaskRequest, Task, TaskStatus } from "./task";

export class TaskRepository {
  async save(taskReq: CreateTaskRequest): Promise<Task> {
    const result = await this.execute(() =>
      prisma.task.create({
        data: {
          title: taskReq.title,
          status: taskReq.status,
          projectId: taskReq.projectId,
          assigneeId: taskReq.assigneeId ?? null,
        },
      }),
    );

    return this.toTask(result);
  }

  async findById(id: number): Promise<Task> {
    const result = await this.execute(() =>
      prisma.task.findUniqueOrThrow({ where: { id } }),
    );
    return this.toTask(result);
  }

  async fetchTasks(): Promise<Task[]> {
    const rawTasks: TaskModel[] = await this.execute(() =>
      prisma.task.findMany(),
    );
    return rawTasks.map((task) => this.toTask(task));
  }

  async findByProjectId(projectId: number): Promise<Task[]> {
    const rawTasks: TaskModel[] = await this.execute(() =>
      prisma.task.findMany({ where: { projectId } }),
    );
    return rawTasks.map((task) => this.toTask(task));
  }

  async findByAssigneeId(assigneeId: number): Promise<Task[]> {
    const rawTasks: TaskModel[] = await this.execute(() =>
      prisma.task.findMany({ where: { assigneeId } }),
    );
    return rawTasks.map((task) => this.toTask(task));
  }

  private toTask(task: TaskModel): Task {
    return new Task(
      task.id,
      task.title,
      task.status as TaskStatus,
      task.projectId,
      task.assigneeId,
    );
  }

  private execute<T>(action: () => Promise<T>): Promise<T> {
    return runDb(action, (error: Prisma.PrismaClientKnownRequestError) => {
      switch (error.code) {
        case "P2025":
          throw new AppError("Task not found.", 404);
        case "P2003":
          throw new AppError("Referenced relation does not exist.", 400);
      }
    });
  }
}
