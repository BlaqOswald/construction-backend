import { Request, Response } from "express";
import * as service from "./projects.service";

export const createProject = async (
  req: Request,
  res: Response
) => {
  try {
    const project = await service.createProject(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getProjects = async (
  _req: Request,
  res: Response
) => {
  try {
    const projects = await service.getProjects();
    res.json(projects);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getProject = async (
  req: Request,
  res: Response
) => {
  try {
    const project = await service.getProject(
      req.params.id as string
    );
    res.json(project);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateProject = async (
  req: Request,
  res: Response
) => {
  try {
    const project = await service.updateProject(
      req.params.id as string,
      req.body
    );
    res.json(project);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteProject = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await service.deleteProject(
      req.params.id as string
    );
    res.json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const lockProject = async (
  req: Request,
  res: Response
) => {
  try {
    const project = await service.lockProject(
      req.params.id as string
    );
    res.json(project);
  } catch (error) {
    res.status(500).json(error);
  }
};