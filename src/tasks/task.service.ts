import { AppError } from "../utils/appError";
import { CreateTaskRequest, Task, TaskStatus } from "./task";
import { TaskRepository } from "./task.repository";

export class TaskService {
  constructor(private taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }

  createTask(
    title: string,
    status: TaskStatus,
    projectId: number,
    assigneeId: number | undefined,
  ): Promise<Task> {
    const task: CreateTaskRequest = new CreateTaskRequest(
      title,
      status,
      projectId,
      assigneeId,
    );
    return this.taskRepository.save(task);
  }

  async getTask(id: number): Promise<Task> {
    const found = await this.taskRepository.findById(id);
    if (found == null) {
      throw new AppError("Task not found", 404);
    }
    return found;
  }

  async getTasks(): Promise<Task[]> {
    return await this.taskRepository.fetchTasks();
  }

  async getTasksByProject(projectId: number): Promise<Task[]> {
    return await this.taskRepository.findByProjectId(projectId);
  }

  async getTasksByAssignee(assigneeId: number): Promise<Task[]> {
    return await this.taskRepository.findByAssigneeId(assigneeId);
  }
}
