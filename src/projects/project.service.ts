import { AppError } from "../utils/appError";
import { CreateProjectRequest, Project } from "./project";
import { ProjectRepository } from "./project.repository";

export class ProjectService {
  constructor(private projectRepository: ProjectRepository) {
    this.projectRepository = projectRepository;
  }

  async createProject(
    title: string,
    description: string | undefined,
    ownerId: number,
  ): Promise<Project> {
    const project: CreateProjectRequest = new CreateProjectRequest(
      title,
      description,
      ownerId,
    );
    return await this.projectRepository.save(project);
  }

  async getProject(id: number): Promise<Project> {
    const found = await this.projectRepository.findById(id);
    if (found == null) {
      throw new AppError("Project not found", 404);
    }
    return found;
  }

  async getProjects(): Promise<Project[]> {
    return await this.projectRepository.fetchProjects();
  }
}
