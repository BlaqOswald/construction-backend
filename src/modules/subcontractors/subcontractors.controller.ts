import { Request, Response } from "express";
import * as service from "./subcontractors.service";

// GET
export const getByProject = async (req: Request, res: Response) => {
  try {
    const projectIdParam = req.params.projectId;
    const projectId = Array.isArray(projectIdParam)
      ? projectIdParam[0]
      : projectIdParam;

    const result = await service.getByProject(projectId);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch subcontractors" });
  }
};

// CREATE
export const addSubcontractor = async (req: Request, res: Response) => {
  try {
    const result = await service.addSubcontractor(req.body);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Create failed" });
  }
};

// DELETE
export const deleteSub = async (req: Request, res: Response) => {
  try {
    const idParam = req.params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;

    await service.deleteSubcontractor(id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

// 💰 PAYMENT ENDPOINT (NEW)
export const addPayment = async (req: Request, res: Response) => {
  try {
    const idParam = req.params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;

    const result = await service.addPayment(id, req.body);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment failed" });
  }
};