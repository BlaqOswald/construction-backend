import { Request, Response } from "express";
import * as service from "./materials.service";

// CREATE
export const addMaterial = async (req: Request, res: Response) => {
  try {
    const result = await service.addMaterial(req.body);
    return res.status(201).json(result);
  } catch (err: any) {
    console.error("ADD ERROR:", err.message);
    return res.status(500).json({ message: "Error adding material" });
  }
};

// GET BY PROJECT
export const getByProject = async (req: Request, res: Response) => {
  try {
    const projectId = String(req.params.projectId); // 🔥 FIX

    const result = await service.getByProject(projectId);

    return res.json(result);
  } catch (err: any) {
    console.error("FETCH ERROR:", err.message);
    return res.status(500).json({ message: "Error fetching materials" });
  }
};

// DELETE
export const deleteMaterial = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id); // 🔥 FIX

    await service.deleteMaterial(id);

    return res.json({ message: "Deleted successfully" });
  } catch (err: any) {
    console.error("DELETE ERROR:", err.message);
    return res.status(500).json({ message: "Delete failed" });
  }
};

// UPDATE
export const updateMaterial = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id); // 🔥 FIX

    const result = await service.updateMaterial(id, req.body);

    return res.json(result);
  } catch (err: any) {
    console.error("UPDATE ERROR:", err.message);
    return res.status(500).json({ message: "Update failed" });
  }
};