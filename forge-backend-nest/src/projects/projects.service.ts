import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProjectsRepository } from './projects.repository';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly projectRepository: ProjectsRepository) {}

  async createProject(dto: CreateProjectDto & { ownerId: number }) {
    return this.projectRepository.save(dto);
  }

  async getProjects(userId: number, userRole: string) {
    const isAdmin = userRole === 'ADMIN';
    return this.projectRepository.findAllScoped(userId, isAdmin);
  }

  async getProject(id: number, userId: number, userRole: string) {
    const isAdmin = userRole === 'ADMIN';
    const project = await this.projectRepository.findByIdScoped(
      id,
      userId,
      isAdmin,
    );

    if (!project) {
      throw new NotFoundException(
        `Project with ID ${id} not found or access denied.`,
      );
    }

    return project;
  }

  async addMemberToProject(
    projectId: number,
    newMemberId: number,
    callerUserId: number,
    userRole: string,
  ) {
    const isAdmin = userRole === 'ADMIN';
    await this.projectRepository.addMember(
      projectId,
      newMemberId,
      callerUserId,
      isAdmin,
    );
    return `User ${newMemberId} added to project ${projectId} successfully.`;
  }

  async getProjectMembers(projectId: number, userId: number, userRole: string) {
    const isAdmin = userRole === 'ADMIN';
    const project = await this.projectRepository.findByIdScoped(
      projectId,
      userId,
      isAdmin,
      true,
    );

    if (!project) {
      throw new NotFoundException(
        `Project with ID ${projectId} not found or access denied.`,
      );
    }

    return project.members ?? [];
  }

  async deleteProject(id: number, callerUserId: number, userRole: string) {
    const isAdmin = userRole === 'ADMIN';
    const deleted = await this.projectRepository.deleteScoped(
      id,
      callerUserId,
      isAdmin,
    );

    if (!deleted) {
      throw new ForbiddenException(
        'Project not found or you do not have permission to delete it.',
      );
    }

    return { id };
  }
}
