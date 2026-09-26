import { Injectable } from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TasksRepository) {}

  private isAdmin(role: string): boolean {
    return role === 'ADMIN';
  }

  async createTask(dto: CreateTaskDto, userId: number, userRole: string) {
    return this.taskRepository.save(dto, userId, this.isAdmin(userRole));
  }

  async getTask(id: number, userId: number, userRole: string) {
    return this.taskRepository.findByIdScoped(
      id,
      userId,
      this.isAdmin(userRole),
    );
  }

  async getTasks(userId: number, userRole: string) {
    return this.taskRepository.findAllScoped(userId, this.isAdmin(userRole));
  }

  async getTasksByProject(projectId: number, userId: number, userRole: string) {
    return this.taskRepository.findByProjectScoped(
      projectId,
      userId,
      this.isAdmin(userRole),
    );
  }

  async getTasksByAssignee(
    assigneeId: number,
    userId: number,
    userRole: string,
  ) {
    return this.taskRepository.findByAssigneeScoped(
      assigneeId,
      userId,
      this.isAdmin(userRole),
    );
  }

  async updateTask(
    id: number,
    dto: UpdateTaskDto,
    userId: number,
    userRole: string,
  ) {
    return this.taskRepository.updateScoped(
      id,
      dto,
      userId,
      this.isAdmin(userRole),
    );
  }

  async deleteTask(id: number, userId: number, userRole: string) {
    await this.taskRepository.deleteScoped(id, userId, this.isAdmin(userRole));
    return { id };
  }
}
