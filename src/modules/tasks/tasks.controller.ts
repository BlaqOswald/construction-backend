import { Request, Response } from "express";
import * as service from "./tasks.service";

/* ================= SAFE PARAM HELPER ================= */
const getId = (val: any) => (Array.isArray(val) ? val[0] : val);

/* ================= CREATE ================= */
export const createTask = async (req: Request, res: Response) => {
  try {
    const result = await service.createTask(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating task" });
  }
};

/* ================= GET ================= */
export const getByProject = async (req: Request, res: Response) => {
  try {
    const projectId = getId(req.params.projectId);
    const result = await service.getByProject(projectId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

/* ================= UPDATE ================= */
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

/* ================= DELETE ================= */
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

export const getTaskLogs = async (req: Request, res: Response) => {
  try {
    const taskId = getId(req.params.taskId);
    const result = await service.getTaskLogs(taskId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error fetching logs" });
  }
};