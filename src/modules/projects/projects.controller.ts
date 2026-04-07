import { Request, Response } from "express";
import * as service from "./projects.service";

// ✅ Create project
export const createProject = async (req: Request, res: Response) => {
  try {
    const project = await service.createProject(req.body);
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Error creating project" });
  }
};

// ✅ Get all projects
export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await service.getProjects();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Error fetching projects" });
  }
};

// ✅ Get single project
export const getProject = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id as string;

    const project = await service.getProject(projectId);

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Error fetching project" });
  }
};

// ✅ Lock project (admin feature)
export const lockProject = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id as string;

    const project = await service.lockProject(projectId);

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Error locking project" });
  }
};
