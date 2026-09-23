import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { UserService } from "./user.service";
import { User } from "./user";
import { AppError } from "../utils/appError";

const CreateUserSchema = z.object({
  name: z.string().min(1, "name is required"),
  email: z.email("email must be valid"),
});

const UserIdSchema = z.coerce.number().int().nonnegative();

export class UserController {
  constructor(private userService: UserService) {}

  getUser = (req: Request, res: Response, next: NextFunction) => {
    const validationRes = UserIdSchema.safeParse(req.params.id);

    if (!validationRes.success) {
      const validationDetails = z.treeifyError(validationRes.error);

      return next(new AppError("Validation failed", 400, validationDetails));
    }
    try {
      const user: User = this.userService.getUser(validationRes.data);
      return res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  };

  createUser = (req: Request, res: Response, next: NextFunction) => {
    const result = CreateUserSchema.safeParse(req.body);

    if (!result.success) {
      return res
        .status(400)
        .json({ properties: z.treeifyError(result.error).properties });
    }

    try {
      const user = this.userService.createUser(
        result.data.name,
        result.data.email,
      );
      return res
        .status(201)
        .json({ id: user.id, name: user.name, email: user.email });
    } catch (error) {
      next(error);
    }
  };

  getUsers = (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = this.userService.getUsers();
      return res.status(200).json({ users });
    } catch (error) {
      next(error);
    }
  };
}
