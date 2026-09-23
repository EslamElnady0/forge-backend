import { Message } from "./../node_modules/esbuild/lib/main.d";
import { User } from "./user";
import { UserService } from "./user.service";
import { Request, Response, NextFunction } from "express";
import { Validator } from "./validator";

export class UserController {
  constructor(private userService: UserService) {
    this.userService = userService;
  }

  getUser = (req: Request, res: Response, next: NextFunction): unknown => {
    try {
      const rawId = req.params.id as string;

      if (!/^\d+$/.test(rawId)) {
        return res.status(400).json({ error: "ID must be a valid number" });
      }

      let id = parseInt(rawId, 10);

      const user: User = this.userService.getUser(id);

      return res.status(200).json({
        user,
      });
    } catch (error) {
      const castedError = error as Error;

      return res.status(404).json({
        message: castedError.message,
      });
    }
  };
  createUser = (req: Request, res: Response, next: NextFunction): unknown => {
    try {
      const name = req.body.name as string;
      const email = req.body.email as string;

      const errors = Validator.validate((v) => {
        v.for("name", name).required();
        v.for("email", email).required().isEmail();
      });

      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const user = this.userService.createUser(name, email);

      return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      const castedError = error as Error;

      return res.status(404).json({
        message: castedError.message,
      });
    }
  };

  getUsers = (req: Request, res: Response, next: NextFunction): unknown => {
    try {
      const users = this.userService.getUsers();
      return res.status(200).json({
        users,
      });
    } catch (error) {
      const castedError = error as Error;

      return res.status(404).json({
        message: castedError.message,
      });
    }
  };
}
