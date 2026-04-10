import { Request, Response } from "express";
import * as service from "./subcontractors.service";

export const addSubcontractor = async (req: Request, res: Response) => {
  try {
    const data = await service.addSubcontractor(req.body);
    res.json(data);
  } catch (err) {
    console.error("SUBCONTRACTOR ERROR:", err);
    res.status(500).json({ message: "Error adding subcontractor" });
  }
};

export const getByTask = async (req: Request, res: Response) => {
  try {
    const taskId  = req.params.taskId as string;
    const data = await service.getByTask(taskId);
    res.json(data);
  } catch (err) {
    console.error("FETCH SUBCONTRACTORS ERROR:", err);
    res.status(500).json({ message: "Error fetching subcontractors" });
  }
};