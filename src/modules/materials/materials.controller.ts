import { Request, Response } from "express";
import * as service from "./materials.service";

export const addMaterial = async (req: Request, res: Response) => {
  try {
    console.log("BODY:", req.body); // 🔥 DEBUG

    const result = await service.addMaterial(req.body);

    return res.status(201).json(result);
  } catch (err: any) {
    console.error("ADD ERROR:", err.message);
    return res.status(500).json({
      message: "Error adding material",
      error: err.message,
    });
  }
};

export const getByProject = async (req: Request, res: Response) => {
  try {
    const projectId = String(req.params.projectId);

    const result = await service.getByProject(projectId);

    return res.json(result);
  } catch (err: any) {
    console.error("FETCH ERROR:", err.message);
    return res.status(500).json({
      message: "Error fetching materials",
      error: err.message,
    });
  }
};

export const deleteMaterial = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    await service.deleteMaterial(id);

    return res.json({ message: "Deleted successfully" });
  } catch (err: any) {
    console.error("DELETE ERROR:", err.message);
    return res.status(500).json({
      message: "Delete failed",
      error: err.message,
    });
  }
};

export const updateMaterial = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    const result = await service.updateMaterial(id, req.body);

    return res.json(result);
  } catch (err: any) {
    console.error("UPDATE ERROR:", err.message);
    return res.status(500).json({
      message: "Update failed",
      error: err.message,
    });
  }
};