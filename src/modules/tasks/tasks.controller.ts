import { Request, Response } from "express";
import * as service from "./tasks.service";

const getId = (val: any) => (Array.isArray(val) ? val[0] : val);

/* ================= TASKS ================= */

export const createTask = async (req: Request, res: Response) => {
  try {
    const result = await service.createTask(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating task" });
  }
};

export const getByProject = async (req: any, res: Response) => {
  try {
    const projectId = getId(req.params.projectId);
    const result = await service.getByProject(req.user, projectId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const id = getId(req.params.id);
    const result = await service.updateTask(id, req.body);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating task" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const id = getId(req.params.id);
    await service.deleteTask(id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task" });
  }
};

/* ================= TASK LOGS ================= */

export const addTaskLog = async (req: Request, res: Response) => {
  try {
    const result = await service.addTaskLog(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error adding log" });
  }
};

export const updateTaskLog = async (req: Request, res: Response) => {
  try {
    const id = getId(req.params.id);
    const result = await service.updateTaskLog(id, req.body);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating log" });
  }
};

export const deleteTaskLog = async (req: Request, res: Response) => {
  try {
    const id = getId(req.params.id);
    await service.deleteTaskLog(id);
    res.json({ message: "Log deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting log" });
  }
};

export const getTaskLogs = async (req: Request, res: Response) => {
  try {
    const projectId = getId(req.params.projectId);
    const result = await service.getTaskLogs(projectId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error fetching logs" });
  }
};

