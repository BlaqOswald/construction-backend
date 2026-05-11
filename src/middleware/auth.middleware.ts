import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

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

    console.log("🔵 AUTH HEADER:", authHeader);

    if (!authHeader) {
      return res.status(403).json({ message: "No token provided" });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
      return res.status(403).json({
        message: "Invalid token format (Bearer <token>)",
      });
    }

    const token = parts[1];

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return res.status(500).json({
        message: "JWT_SECRET missing in environment",
      });
    }

    const decoded = jwt.verify(token, secret);

    req.user = decoded;

    next();
  } catch (err: any) {
    console.log("❌ JWT ERROR:", err.message);

    return res.status(403).json({
      message: "Invalid or expired token",
      error: err.message,
    });
  }
};