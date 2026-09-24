import { Router } from "express";
import userRouter from "../users/user.routes";
import projectRouter from "../projects/project.routes";
import taskRouter from "../tasks/task.routes";

const apiRouter = Router();

apiRouter.use("/users", userRouter);
apiRouter.use("/projects", projectRouter);
apiRouter.use("/tasks", taskRouter);

export default apiRouter;
