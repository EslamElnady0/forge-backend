import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project, ProjectMember } from './entities/project.entity';
import { ProjectsRepository } from './projects.repository';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly projectRepository: ProjectsRepository,
    private readonly usersService: UsersService,
  ) {}

  async createProject(dto: CreateProjectDto): Promise<Project> {
    await this.usersService.getUser(dto.ownerId);
    return this.projectRepository.save(dto);
  }

  async getProject(id: number): Promise<Project> {
    return this.projectRepository.findById(id);
  }

  async getProjects(): Promise<Project[]> {
    return this.projectRepository.fetchProjects();
  }

  async getUserProjects(userId: number): Promise<Project[]> {
    await this.usersService.getUser(userId);
    return this.projectRepository.fetchUserProjects(userId);
  }

  async addMemberToProject(
    projectId: number,
    userId: number,
  ): Promise<{ message: string }> {
    await this.getProject(projectId);
    await this.usersService.getUser(userId);
    return this.projectRepository.addMember(projectId, userId);
  }

  async getProjectMembers(projectId: number): Promise<ProjectMember[]> {
    await this.getProject(projectId);
    return this.projectRepository.fetchProjectMembers(projectId);
  }

  async isUserMemberOrOwner(
    projectId: number,
    userId: number,
  ): Promise<boolean> {
    return this.projectRepository.isUserMemberOrOwner(projectId, userId);
  }
}
