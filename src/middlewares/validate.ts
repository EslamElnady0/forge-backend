import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";
import { AppError } from "../utils/appError";

type RequestShape = {
  body?: any;
  params?: any;
  query?: any;
};

export const validate =
  (schema: ZodType<any>) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = (await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      })) as RequestShape;

      if (parsed.body !== undefined) req.body = parsed.body;
      if (parsed.params !== undefined) req.params = parsed.params;
      if (parsed.query !== undefined) req.query = parsed.query;

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((issue) => ({
          location: issue.path[0],
          field: issue.path.slice(1).join("."),
          message: issue.message,
        }));

        return next(new AppError("Validation failed", 400, formattedErrors));
      }

      return next(error);
    }
  };
