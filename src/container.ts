import { UserController } from "./users/user.controller";
import { UserService } from "./users/user.service";
import { UserRepository } from "./users/user.repository";
import { ProjectController } from "./projects/project.controller";
import { ProjectService } from "./projects/project.service";
import { ProjectRepository } from "./projects/project.repository";
import { TaskController } from "./tasks/task.controller";
import { TaskService } from "./tasks/task.service";
import { TaskRepository } from "./tasks/task.repository";

export let projectRepo = new ProjectRepository();
export let userRepo = new UserRepository();
export let taskRepo = new TaskRepository();
//======================================
export let userService = new UserService(userRepo);
export let projectService = new ProjectService(projectRepo, userRepo);
export let taskService = new TaskService(taskRepo, projectRepo, userRepo);
//=======================================
export let userController = new UserController(userService);
export let projectController = new ProjectController(projectService);
export let taskController = new TaskController(taskService);
//=======================================
