import { Request, Response } from "express";
import * as service from "./subcontractors.service";

/**
 * SAFE STRING EXTRACTOR
 */
const getString = (val: string | string[] | undefined): string => {
  if (!val) return "";
  return Array.isArray(val) ? val[0] : val;
};

export const addSubcontractor = async (req: Request, res: Response) => {
  try {
    const result = await service.addSubcontractor(req.body);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating subcontractor" });
  }
};

export const getByProject = async (req: Request, res: Response) => {
  try {
    const projectId = getString(req.params.projectId);

    if (!projectId) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    const result = await service.getByProject(projectId);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching subcontractors" });
  }
};

export const deleteSub = async (req: Request, res: Response) => {
  try {
    const id = getString(req.params.id);

    await service.deleteSubcontractor(id);

    res.json({ message: "deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
};

/**
 * PAYMENT CONTROLLER
 */
export const addPayment = async (req: Request, res: Response) => {
  try {
    const { subcontractor_id, amount_paid, payment_date, note } = req.body;

    const result = await service.addPayment(
      subcontractor_id,
      amount_paid,
      payment_date,
      note
    );

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment failed" });
  }
};