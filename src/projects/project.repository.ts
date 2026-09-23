import { Project } from "./project";

type NullableProject = Project | undefined;

let projects: Project[] = [];

export class ProjectRepository {
  save(project: Project): Project {
    projects.push(project);
    return project;
  }

  findById(id: number): NullableProject {
    let proj = projects.find((user) => {
      return user.id === id;
    });

    return proj;
  }

  fetchProjects(): Project[] {
    return projects;
  }
}
