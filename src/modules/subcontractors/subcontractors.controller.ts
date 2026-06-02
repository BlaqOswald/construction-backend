import { Request, Response } from "express";
import * as service from "./subcontractors.service";

// SAFE ID FIX
const getId = (val: any) =>
  Array.isArray(val) ? val[0] : val;

// ================= CREATE =================
export const addSubcontractor = async (req: Request, res: Response) => {
  try {
    const result = await service.addSubcontractor(req.body);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Create failed" });
  }
};

// ================= GET =================
export const getByProject = async (req: Request, res: Response) => {
  try {
    const projectId = getId(req.params.projectId);
    const result = await service.getByProject(projectId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
};

// ================= DELETE =================
export const deleteSub = async (req: Request, res: Response) => {
  try {
    const id = getId(req.params.id);
    await service.deleteSubcontractor(id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

// ================= PAYMENT =================
export const addPayment = async (req: Request, res: Response) => {
  try {
    const id = getId(req.params.id);
    const result = await service.addPayment(id, req.body);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment failed" });
  }
};

export const updateSub = async (req: Request, res: Response) => {
  try {
    const id = getId(req.params.id);

    const result = await service.updateSubcontractor(
      id,
      req.body
    );

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};