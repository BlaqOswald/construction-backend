import { Request, Response } from "express";
import * as service from "./materials.service";

// ➕ Add Material
export const addMaterial = async (req: Request, res: Response) => {
  try {
    const material = await service.addMaterial(req.body);
    res.json(material);
  } catch (err) {
    console.error("ADD MATERIAL ERROR:", err);
    res.status(500).json({ message: "Error adding material" });
  }
};

// 📦 Get Materials by Task
export const getMaterials = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId as string;
    const materials = await service.getMaterialsByTask(taskId);
    res.json(materials);
  } catch (err) {
    console.error("GET MATERIALS ERROR:", err);
    res.status(500).json({ message: "Error fetching materials" });
  }
};
