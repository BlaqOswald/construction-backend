import { Request, Response } from "express";
import * as service from "./tasks.service";

export const createTask = (req: Request, res: Response) => {
  res.json(service.createTask(req.body));
};

export const getTasks = (req: Request, res: Response) => {
  const projectId = req.params.projectId as string;

  const tasks = service.getTasksByProject(projectId);

  res.json(tasks);
};
