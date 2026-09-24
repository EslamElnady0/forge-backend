import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";
import { User } from "./user";
import { CreateUserInput, UserIdParamInput } from "./user.schema";

export class UserController {
  constructor(private userService: UserService) {}

  getUser = async (
    req: Request<any, any, UserIdParamInput["params"]>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;

      const user: User = await this.userService.getUser(id);
      return res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  };

  createUser = async (
    req: Request<any, any, CreateUserInput["body"]>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { name, email } = req.body;

      const user = await this.userService.createUser(name, email);
      return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      next(error);
    }
  };

  getUsers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getUsers();
      return res.status(200).json({ users });
    } catch (error) {
      next(error);
    }
  };
}
