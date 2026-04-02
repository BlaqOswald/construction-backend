import { Request, Response, NextFunction } from "express";

export const requireRole = (roles: string | string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: "Forbidden: Access denied",
      });
    }

    next();
  };
};
