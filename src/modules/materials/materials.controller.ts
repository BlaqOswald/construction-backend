import { Request, Response } from "express";
import * as service from "./materials.service";

export const addMaterial = (req: Request, res: Response) => {
  res.json(service.addMaterial(req.body));
};

export const getMaterials = (req: Request, res: Response) => {
  const taskId = req.params.taskId as string;

  const materials = service.getMaterialsByTask(taskId);

  res.json(materials);
};
