import { Request, Response } from "express";
import * as service from "./tasks.service";

export const addTask = async (req: Request, res: Response) => {
  try {
    const task = await service.addTask(req.body);
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating task" });
  }
};

export const getTasksByProject = async (req: Request, res: Response) => {
  try {
    const projectId = Array.isArray(req.params.projectId)
      ? req.params.projectId[0]
      : req.params.projectId;

    const tasks = await service.getTasksByProject(projectId);
    res.json(tasks);
  } catch (err) {
    console.error("FETCH TASKS ERROR:", err);
    res.status(500).json({ message: "Error fetching tasks" });
  }
};
export const getTaskById = async (req: Request, res: Response) => {
  try {
    const taskId = String(req.params.taskId);

    const task = await service.getTaskById(taskId);
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching task" });
  }
};
