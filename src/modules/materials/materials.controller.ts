import { Request, Response } from "express";
import * as service from "./materials.service";

export const addMaterial = async (req: Request, res: Response) => {
  try {
    console.log("🔥 MATERIAL REQUEST BODY:", req.body);

    const data = await service.addMaterial(req.body);

    console.log("✅ INSERTED MATERIAL:", data);

    res.json(data);
  } catch (err) {
    console.error("❌ ADD MATERIAL ERROR:", err);
    res.status(500).json({ message: "Error adding material" });
  }
};
export const getByProject = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.projectId as string;

    const data = await service.getByProject(projectId);

    res.json(data);
  } catch (err) {
    console.error("❌ FETCH MATERIALS ERROR:", err);
    res.status(500).json({ message: "Error fetching materials" });
  }
};

export const deleteMaterial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // delete DB logic

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const updateMaterial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // update DB logic

    res.json({ message: "Updated successfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
};
