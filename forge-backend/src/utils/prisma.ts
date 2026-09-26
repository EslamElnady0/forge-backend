import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "../generated/prisma/client";
import { AppError } from "./appError";

const connectionString = process.env.DATABASE_URL || "";

const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({
  adapter,
  log: ["query", "error"],
});

export async function runDb<T>(
  action: () => Promise<T>,
  mapKnownError?: (error: Prisma.PrismaClientKnownRequestError) => void,
): Promise<T> {
  try {
    return await action();
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientInitializationError ||
      error instanceof Prisma.PrismaClientRustPanicError
    ) {
      throw new AppError("Database service is currently unreachable.", 503);
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      mapKnownError
    ) {
      mapKnownError(error);
    }
    throw error;
  }
}
