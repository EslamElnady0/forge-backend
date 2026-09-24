import { Prisma } from "../generated/prisma/client";
import { UserModel } from "../generated/prisma/models";
import { AppError } from "../utils/appError";
import { prisma } from "../utils/prisma";
import { CreateUserRequest, User } from "./user";

export class UserRepository {
  private async execute<T>(action: () => Promise<T>): Promise<T> {
    try {
      return await action();
    } catch (error) {
      if (error instanceof Prisma.PrismaClientInitializationError) {
        throw new AppError("Database service is currently unreachable.", 503);
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2002": {
            throw new AppError(`This email is already in use.`, 409);
          }
          case "P2025": {
            throw new AppError(`User not found.`, 404);
          }
        }
      }

      throw error;
    }
  }

  async save(userReq: CreateUserRequest): Promise<User> {
    const result = await this.execute(() =>
      prisma.user.create({
        data: {
          name: userReq.name,
          email: userReq.email,
        },
      }),
    );

    return new User(result.id, result.name, result.email);
  }

  async findById(id: number): Promise<User> {
    const result = await this.execute(() =>
      prisma.user.findUniqueOrThrow({ where: { id } }),
    );

    return new User(result.id, result.name, result.email);
  }

  async fetchUsers(): Promise<User[]> {
    const rawUsers: UserModel[] = await this.execute(() =>
      prisma.user.findMany(),
    );
    return rawUsers.map((user) => new User(user.id, user.name, user.email));
  }
}
