import { UserController } from "./user.controller";
import "dotenv/config";
import express, { NextFunction } from "express";
import { User } from "./user";
import { Validator } from "./validator";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";
const app = express();
const PORT = process.env.PORT || 5005;

app.use(express.json());

//Check the content type of the post request

let userController = new UserController(new UserService(new UserRepository()));
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

//Server Serving lol
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
