import { Router } from "express";
import { taskController } from "../container";

const taskRouter = Router();

taskRouter.get("/", taskController.getTasks);
taskRouter.post("/", taskController.createTask);
taskRouter.get("/:id", taskController.getTask);

export default taskRouter;
