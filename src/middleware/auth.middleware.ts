import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Extend Request type safely
interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // =========================
    // DEBUG: show full request headers
    // =========================
    console.log("🔵 FULL HEADERS:", req.headers);

    const authHeader = req.headers.authorization;

    console.log("🔵 AUTH HEADER:", authHeader);

    // =========================
    // NO TOKEN CASE
    // =========================
    if (!authHeader) {
      console.log("❌ NO AUTH HEADER FOUND");
      return res.status(403).json({
        message: "No token provided",
      });
    }

    // =========================
    // EXTRACT TOKEN
    // =========================
    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
      console.log("❌ MALFORMED AUTH HEADER:", authHeader);
      return res.status(403).json({
        message: "Invalid authorization format. Expected: Bearer <token>",
      });
    }

    const token = parts[1];

    console.log("🔵 TOKEN RECEIVED:", token);

    // =========================
    // CHECK SECRET
    // =========================
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("❌ JWT_SECRET NOT FOUND IN ENV");
      return res.status(500).json({
        message: "Server misconfiguration: missing JWT secret",
      });
    }

    // =========================
    // VERIFY TOKEN
    // =========================
    const decoded = jwt.verify(token, secret);

    console.log("✅ TOKEN VALID:", decoded);

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