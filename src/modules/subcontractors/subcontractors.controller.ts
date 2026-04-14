import { Request, Response } from "express";
import * as service from "./subcontractors.service";

// ADD
export const addSubcontractor = async (req: Request, res: Response) => {
  try {
    const result = await service.addSubcontractor(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: "Error adding subcontractor" });
  }
};

// GET BY PROJECT
export const getByProject = async (req: Request, res: Response) => {
  try {
    const projectId = String(req.params.projectId);
    const result = await service.getByProject(projectId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error fetching subcontractors" });
  }
};

// DELETE ONLY (because service supports it)
export const deleteSub = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await service.deleteSubcontractor(id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting subcontractor" });
  }
};
