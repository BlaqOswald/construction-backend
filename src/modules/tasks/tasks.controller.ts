import { Request, Response } from "express";
import * as service from "./tasks.service";

/**
 * CREATE TASK
 */
export const addTask = async (req: Request, res: Response) => {
  try {
    const task = await service.addTask(req.body);
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Error creating task" });
  }
};

/**
 * GET TASKS BY PROJECT
 */
export const getTasksByProject = async (req: Request, res: Response) => {
  try {
    const projectId =
      typeof req.params.projectId === "string"
        ? req.params.projectId
        : req.params.projectId?.[0];

    const tasks = await service.getTasksByProject(projectId || "");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

/**
 * GET TASK BY ID
 */
export const getTaskById = async (req: Request, res: Response) => {
  try {
    const taskId =
      typeof req.params.taskId === "string"
        ? req.params.taskId
        : req.params.taskId?.[0];

    const task = await service.getTaskById(taskId || "");
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Error fetching task" });
  }
};