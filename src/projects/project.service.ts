import { AppError } from "../utils/appError";
import { Project } from "./project";
import { ProjectRepository } from "./project.repository";

export class ProjectService {
  constructor(private projectRepository: ProjectRepository) {
    this.projectRepository = projectRepository;
  }

  createProject(title: string, description: string, ownerId: number): Project {
    const project: Project = new Project(title, description, ownerId);
    return this.projectRepository.save(project);
  }

  getProject(id: number): Project {
    const found = this.projectRepository.findById(id);
    if (found == null) {
      throw new AppError("Project not found", 404);
    }
    return found;
  }

  getProjects(): Project[] {
    return this.projectRepository.fetchProjects();
  }
}
