// src/projects/project.service.ts
import { AppError } from "../utils/appError";
import { CreateProjectRequest, Project } from "./project";
import { ProjectRepository } from "./project.repository";
import { UserRepository } from "../users/user.repository";

export class ProjectService {
  constructor(
    private projectRepository: ProjectRepository,
    private userRepository: UserRepository,
  ) {}

  async createProject(
    title: string,
    description: string | undefined,
    ownerId: number,
  ): Promise<Project> {
    await this.userRepository.findById(ownerId);

    const project = new CreateProjectRequest(title, description, ownerId);
    return await this.projectRepository.save(project);
  }

  async getProject(id: number): Promise<Project> {
    return await this.projectRepository.findById(id);
  }

  async getProjects(): Promise<Project[]> {
    return await this.projectRepository.fetchProjects();
  }
}
