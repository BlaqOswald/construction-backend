import { Request, Response } from "express";
import * as service from "./subcontractors.service";

export const addSubcontractor = (req: Request, res: Response) => {
  res.json(service.addSubcontractor(req.body));
};

export const getSubcontractors = (req: Request, res: Response) => {
  const taskId = req.params.taskId as string;

  const subcontractors = service.getByTask(taskId);

  res.json(subcontractors);
};
