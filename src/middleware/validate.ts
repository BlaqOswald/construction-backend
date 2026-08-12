// src/middleware/validate.ts
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";

export const validateDto = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(dtoClass, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      const messages = errors
        .map((e) => Object.values(e.constraints || {}))
        .flat();
      return res
        .status(400)
        .json({ message: "Validation failed", errors: messages });
    }
    next();
  };
};

export const validateUuidParam = (paramName: string) => {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return (req: Request, res: Response, next: NextFunction) => {
    const value = req.params[paramName];
    if (typeof value !== "string" || !uuidPattern.test(value)) {
      return res.status(400).json({ message: `${paramName} must be a valid UUID` });
    }
    next();
  };
};
