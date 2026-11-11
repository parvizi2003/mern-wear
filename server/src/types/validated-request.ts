import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

type ValidatedHandler<T> = (data: T, res: Response) => Promise<void> | void;

export const validate =
  <T>(schema: ZodType<T>, handler: ValidatedHandler<T>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: "Validation error",
        errors: result.error.issues,
      });
      return;
    }

    try {
      await handler(result.data, res);
    } catch (error) {
      next(error);
    }
  };
