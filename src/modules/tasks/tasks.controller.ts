import { Request, Response } from "express";
import * as service from "./tasks.service";

// ✅ Create Task
export const createTask = async (req: Request, res: Response) => {
  try {
    const task = await service.createTask(req.body);
    res.json(task);
  } catch (err) {
    console.error("CREATE TASK ERROR:", err);
    res.status(500).json({ message: "Error creating task" });
  }
};

// ✅ Get Tasks by Project
export const getTasks = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.projectId as string;

    const tasks = await service.getTasksByProject(projectId);

    res.json(tasks);
  } catch (err) {
    console.error("GET TASKS ERROR:", err);
    res.status(500).json({ message: "Error fetching tasks" });
  }
};
