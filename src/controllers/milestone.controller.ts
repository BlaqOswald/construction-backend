import { Request, Response } from "express";
import * as service from "../services/milestone.service";

export const createMilestone = async (req: Request, res: Response) => {
  try {
    const ms = await service.createMilestone(req.body);
    res.status(201).json(ms);
  } catch (err: any) {
    const status = err.status ?? 500;
    const message = err.message ?? "Failed to create milestone";
    res.status(status).json({ message });
  }
};

export const getMilestones = async (req: Request, res: Response) => {
  try {
    const projectId = req.query.projectId as string | undefined;
    const milestones = await service.getMilestones(projectId);
    res.json(milestones);
  } catch (err) {
    console.error("[MilestoneController] error:", err);
    res.status(500).json({ message: "Failed to fetch milestones" });
  }
};
