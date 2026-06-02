import { Request, Response } from "express";
import * as service from "./materials.service";

// ======================
// CREATE / UPSERT
// ======================
export const addMaterial = async (req: Request, res: Response) => {
  try {
    if (!req.body.project_id) {
      return res.status(400).json({ message: "project_id required" });
    }

    const result = await service.addMaterial(req.body);
    return res.status(201).json(result);
  } catch (err) {
    console.error("ADD ERROR:", err);
    return res.status(500).json({
      message: "Failed to add material",
      error: err instanceof Error ? err.message : err,
    });
  }
};

// ======================
// GET BY PROJECT
// ======================
export const getByProject = async (req: Request, res: Response) => {
  try {
    const projectId = String(req.params.projectId);
    const result = await service.getByProject(projectId);
    return res.json(result);
  } catch (err) {
    console.error("MATERIAL FETCH ERROR:", err);
    return res.status(500).json({
      message: "Failed to fetch materials",
      error: err instanceof Error ? err.message : err,
    });
  }
};

// ======================
// UPDATE
// ======================
export const updateMaterial = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const result = await service.updateMaterial(id, req.body);
    return res.json(result);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    return res.status(500).json({
      message: "Failed to update material",
      error: err,
    });
  }
};

// ======================
// DELETE
// ======================
export const deleteMaterial = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const result = await service.deleteMaterial(id);
    return res.json(result);
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return res.status(500).json({
      message: "Failed to delete material",
      error: err,
    });
  }
};
