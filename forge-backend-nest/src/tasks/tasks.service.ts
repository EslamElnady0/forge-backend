import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TasksRepository } from './tasks.repository';
import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly usersService: UsersService,
    private readonly projectsService: ProjectsService,
  ) {}

  async createTask(dto: CreateTaskDto): Promise<Task> {
    await this.projectsService.getProject(dto.projectId);

    if (dto.assigneeId != null) {
      await this.usersService.getUser(dto.assigneeId);

      const isMember = await this.projectsService.isUserMemberOrOwner(
        dto.projectId,
        dto.assigneeId,
      );

      if (!isMember) {
        throw new BadRequestException(
          `User with ID ${dto.assigneeId} is not a member of project ${dto.projectId}.`,
        );
      }
    }

    return this.tasksRepository.save(dto);
  }

  async getTask(id: number): Promise<Task> {
    return this.tasksRepository.findById(id);
  }

  async getTasks(): Promise<Task[]> {
    return this.tasksRepository.fetchTasks();
  }

  async getTasksByProject(projectId: number): Promise<Task[]> {
    await this.projectsService.getProject(projectId);
    return this.tasksRepository.findByProjectId(projectId);
  }

  async getTasksByAssignee(assigneeId: number): Promise<Task[]> {
    await this.usersService.getUser(assigneeId);
    return this.tasksRepository.findByAssigneeId(assigneeId);
  }

  async updateTask(id: number, dto: UpdateTaskDto): Promise<Task> {
    if (dto.projectId) {
      await this.projectsService.getProject(dto.projectId);
    }
    if (dto.assigneeId) {
      await this.usersService.getUser(dto.assigneeId);
    }
    return this.tasksRepository.update(id, dto);
  }

  async deleteTask(id: number): Promise<Task> {
    return this.tasksRepository.delete(id);
  }
}
