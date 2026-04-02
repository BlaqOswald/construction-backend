import { Request, Response } from "express";
import * as service from "../services/dashboard.service";

export const getProjectDashboard = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const data = await service.getProjectDashboard(
      req.params.project_id as string,
      user.id
    );

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard" });
  }
};
