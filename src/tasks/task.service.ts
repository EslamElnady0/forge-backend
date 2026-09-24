// src/tasks/task.service.ts
import { AppError } from "../utils/appError";
import { CreateTaskRequest, Task, TaskStatus } from "./task";
import { TaskRepository } from "./task.repository";
import { ProjectRepository } from "../projects/project.repository";
import { UserRepository } from "../users/user.repository";

export class TaskService {
  constructor(
    private taskRepository: TaskRepository,
    private projectRepository: ProjectRepository,
    private userRepository: UserRepository,
  ) {}

  async createTask(
    title: string,
    status: TaskStatus,
    projectId: number,
    assigneeId: number | null | undefined,
  ): Promise<Task> {
    await this.projectRepository.findById(projectId);
    if (assigneeId != null) {
      await this.userRepository.findById(assigneeId);

      const isAuthorized = await this.projectRepository.isUserMemberOrOwner(
        projectId,
        assigneeId,
      );

      if (!isAuthorized) {
        throw new AppError(
          `User with ID ${assigneeId} is not a member of project ${projectId}.`,
          400,
        );
      }
    }

    const task = new CreateTaskRequest(title, status, projectId, assigneeId);
    return await this.taskRepository.save(task);
  }

  async getTask(id: number): Promise<Task> {
    return await this.taskRepository.findById(id);
  }

  async getTasks(): Promise<Task[]> {
    return await this.taskRepository.fetchTasks();
  }

  async getTasksByProject(projectId: number): Promise<Task[]> {
    await this.projectRepository.findById(projectId);
    return await this.taskRepository.findByProjectId(projectId);
  }

  async getTasksByAssignee(assigneeId: number): Promise<Task[]> {
    await this.userRepository.findById(assigneeId);
    return await this.taskRepository.findByAssigneeId(assigneeId);
  }
}
