import { UserController } from "./users/user.controller";
import "dotenv/config";
import express from "express";
import { UserService } from "./users/user.service";
import { UserRepository } from "./users/user.repository";
import { ProjectController } from "./projects/project.controller";
import { ProjectService } from "./projects/project.service";
import { ProjectRepository } from "./projects/project.repository";
import { TaskController } from "./tasks/task.controller";
import { TaskService } from "./tasks/task.service";
import { TaskRepository } from "./tasks/task.repository";
import { AppError } from "./utils/appError";
import { globalErrorHandler } from "./utils/errorHandler";
const app = express();
const PORT = process.env.PORT || 5005;

app.use(express.json());

let projectRepo = new ProjectRepository();
let userRepo = new UserRepository();
let taskRepo = new TaskRepository();
//======================================
let userService = new UserService(userRepo);
let projectService = new ProjectService(projectRepo, userRepo);
let taskService = new TaskService(taskRepo, projectRepo, userRepo);
//=======================================
let userController = new UserController(userService);
let projectController = new ProjectController(projectService);
let taskController = new TaskController(taskService);
//=======================================

//Check the content type of the post request
app.use((req, res, next) => {
  if (
    req.method == "POST" &&
    !(req.headers["content-type"] == "application/json")
  ) {
    return res.status(400).json({
      success: false,
      message: "POST request should have content type of application/json",
    });
  }
  next();
});

//Logger
app.use((req, res, next) => {
  console.log(`[${req.method}] --> ${req.url}`);
  next();
});

//Endpoints

app.get("/api/health", (req, res, next) => {
  console.log(`health endpoint triggered, server running on port ${PORT}`);

  return res.send("Server Working");
});

app.get("/api/users", userController.getUsers);
app.get("/api/users/:id", userController.getUser);
app.post("/api/users", userController.createUser);
app.post("/api/projects", projectController.createProject);
app.get("/api/projects", projectController.getProjects);
app.get("/api/projects/:id", projectController.getProject);
app.post("/api/tasks", taskController.createTask);
app.get("/api/tasks", taskController.getTasks);
app.get("/api/tasks/:id", taskController.getTask);
app.get("/api/projects/:projectId/tasks", taskController.getTasksByProject);
app.get("/api/users/:assigneeId/tasks", taskController.getTasksByAssignee);

//Global Error Handler
app.use(globalErrorHandler);

//Server Serving lol
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
