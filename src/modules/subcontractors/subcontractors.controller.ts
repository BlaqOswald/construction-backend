import { Request, Response } from "express";
import * as service from "./subcontractors.service";

export const addSubcontractor = async (req: Request, res: Response) => {
  try {
    const data = await service.addSubcontractor(req.body);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding subcontractor" });
  }
};

export const getByProject = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.projectId as string; // ✅ FIX HERE

    const data = await service.getByProject(projectId);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching subcontractors" });
  }
};