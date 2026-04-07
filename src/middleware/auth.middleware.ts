import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Extend Express Request type properly (BEST PRACTICE)
interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER:", authHeader);

    if (!authHeader) {
      return res.status(403).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    console.log("TOKEN:", token);

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    console.log("JWT SECRET EXISTS ✔");

    const decoded = jwt.verify(token, secret);

    req.user = decoded;

    next();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";

    console.log("JWT ERROR:", message);

    return res.status(403).json({
      message: "Invalid token",
      error: message,
    });
  }
};
