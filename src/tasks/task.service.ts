import { AppError } from "../utils/appError";
import { Task, TaskStatus } from "./task";
import { TaskRepository } from "./task.repository";

export class TaskService {
  constructor(private taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }

  createTask(
    title: string,
    status: TaskStatus,
    projectId: number,
    assigneeId: number,
  ): Task {
    const t: Task = new Task(title, status, projectId, assigneeId);
    return this.taskRepository.save(t);
  }

  getTask(id: number): Task {
    const found = this.taskRepository.findById(id);
    if (found == null) {
      throw new AppError("Task not found", 404);
    }
    return found;
  }

  getTasks(): Task[] {
    return this.taskRepository.fetchTasks();
  }

  getTasksByProject(projectId: number): Task[] {
    return this.taskRepository.findByProjectId(projectId);
  }

  getTasksByAssignee(assigneeId: number): Task[] {
    return this.taskRepository.findByAssigneeId(assigneeId);
  }
}
