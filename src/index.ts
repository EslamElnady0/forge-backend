import { UserController } from "./users/user.controller";
import "dotenv/config";
import express, { NextFunction } from "express";
import { User } from "./users/user";
import { Validator } from "./validator";
import { UserService } from "./users/user.service";
import { UserRepository } from "./users/user.repository";
import { ProjectController } from "./projects/project.controller";
import { ProjectService } from "./projects/project.service";
import { ProjectRepository } from "./projects/project.repository";
import { TaskController } from "./tasks/task.controller";
import { TaskService } from "./tasks/task.service";
import { TaskRepository } from "./tasks/task.repository";
import { AppError } from "./utils/appError";
const app = express();
const PORT = process.env.PORT || 5005;

app.use(express.json());

//Check the content type of the post request

let userController = new UserController(new UserService(new UserRepository()));
let projectController = new ProjectController(
  new ProjectService(new ProjectRepository()),
);
let taskController = new TaskController(new TaskService(new TaskRepository()));
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
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error(`[ERROR] ${err.message}`);

    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        success: false,
        error: {
          message: err.message,
        },
      });
    }

    return res.status(500).json({
      success: false,
      error: {
        message: "Internal Server Error",
      },
    });
  },
);

//Server Serving lol
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
