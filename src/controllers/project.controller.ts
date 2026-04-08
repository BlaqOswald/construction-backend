import { Request, Response } from "express";
import * as service from "../modules/projects/projects.service";

export const createProject = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const project = await projectService.createProject({
      ...req.body,
      user_id: user.id,
    });

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Error creating project" });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const projects = await projectService.getProjects(user.id);

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects" });
  }
};
