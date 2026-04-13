import { Request, Response } from "express";
import * as service from "./subcontractors.service";

export const addSubcontractor = async (req: Request, res: Response) => {
  try {
    const result = await service.addSubcontractor(req.body);
    res.json(result);
  } catch (err) {
    console.error("❌ ADD ERROR:", err);
    res.status(500).json({ message: "Error adding subcontractor" });
  }
};

export const getByProject = async (req: Request, res: Response) => {
  try {
    const projectId = Array.isArray(req.params.projectId)
      ? req.params.projectId[0]
      : req.params.projectId;

    const result = await service.getByProject(projectId);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching subcontractors" });
  }
};