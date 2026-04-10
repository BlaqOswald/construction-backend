import { Request, Response } from "express";
import * as service from "./materials.service";

export const addMaterial = async (req: Request, res: Response) => {
  try {
    const material = await service.addMaterial(req.body);
    res.json(material);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding material" });
  }
};

export const getMaterials = async (req: Request, res: Response) => {
  try {
    const taskId = String(req.params.taskId);

    const materials = await service.getMaterialsByTask(taskId);
    res.json(materials);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching materials" });
  }
};

export const getByProject = async (req: Request, res: Response) => {
  try {
    const projectId = String(req.params.projectId);

    const materials = await service.getMaterialsByProject(projectId);
    res.json(materials);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching materials" });
  }
};