import { Request, Response } from "express";
import * as service from "../services/dashboard.service";
import { JwtPayload } from "jsonwebtoken";

// Extend Request properly
interface AuthRequest extends Request {
  user?: JwtPayload & { id: string };
}

export const getProjectDashboard = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const user = req.user;

    if (!user || !user.id) {
      return res.status(401).json({ message: "Unauthorized: user missing" });
    }
     const projectId = Array.isArray(req.params.project_id)
      ? req.params.project_id[0]
      : req.params.project_id;
    if (!projectId) {
      return res.status(400).json({ message: "project_id is required" });
    }

    const data = await service.getProjectDashboard(projectId, user.id);

    return res.status(200).json(data);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown server error";

    console.error("Dashboard Error:", message);

    return res.status(500).json({
      message: "Error fetching dashboard",
      error: message,
    });
  }
};
