import { Request, Response } from "express";
import * as service from "../services/project.service";

export const createProject = async (req: Request, res: Response) => {
  const { name, budget } = req.body;
  const project = await service.createProject(name, budget);
  res.json(project);
};

export const getProjects = async (_req: Request, res: Response) => {
  const projects = await service.getProjects();
  res.json(projects);
};
