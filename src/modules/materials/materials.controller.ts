import { Request, Response } from "express";
import * as service from "./materials.service";

// CREATE
export const addMaterial = async (req: Request, res: Response) => {
  try {
    const result = await service.addMaterial(req.body);
    return res.status(201).json(result);
  } catch (err) {
    console.error("ADD ERROR:", err);
    return res.status(500).json({ message: "Add failed", error: err });
  }
};

// GET BY PROJECT
export const getByProject = async (req: Request, res: Response) => {
  try {
    const projectId = String(req.params.projectId);

    const result = await service.getByProject(projectId);
    return res.json(result);
  } catch (err) {
    console.error("FETCH ERROR:", err);
    return res.status(500).json({ message: "Fetch failed", error: err });
  }
};

// DELETE
export const deleteMaterial = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    const result = await service.deleteMaterial(id);
    return res.json(result);
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return res.status(500).json({ message: "Delete failed", error: err });
  }
};

// UPDATE
export const updateMaterial = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    const result = await service.updateMaterial(id, req.body);
    return res.json(result);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    return res.status(500).json({ message: "Update failed", error: err });
  }
};