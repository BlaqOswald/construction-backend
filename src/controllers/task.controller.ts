import { Request, Response } from "express";
import * as service from "../services/task.service";

// CREATE TASK
export const createTask = async (req: Request, res: Response) => {
  try {
    const task = await service.createTask(req.body);
    res.status(201).json(task);
  } catch {
    res.status(500).json({ message: "Error creating task" });
  }
};

// GET ALL TASKS
export const getTasks = async (_req: Request, res: Response) => {
  try {
    const tasks = await service.getTasks();
    res.json(tasks);
  } catch {
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

// GET TASKS BY PROJECT
export const getTasksByProject = async (req: Request, res: Response) => {
  try {
    const tasks = await service.getTasksByProject(
      req.params.project_id as string
    );
    res.json(tasks);
  } catch {
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

// UPDATE STATUS
export const updateStatus = async (req: Request, res: Response) => {
  try {
    const task = await service.updateTaskStatus(
      req.params.id as string,
      req.body.status
    );
    res.json(task);
  } catch {
    res.status(500).json({ message: "Error updating status" });
  }
};
