import { Request, Response } from "express";
import * as service from "./tasks.service";

// CREATE
export const createTask = async (req: Request, res: Response) => {
  try {
    const result = await service.createTask(req.body);
    return res.status(201).json(result);
  } catch (err) {
    console.error("CREATE TASK ERROR:", err);
    return res.status(500).json({ message: "Error creating task" });
  }
};

// GET BY PROJECT
export const getByProject = async (req: Request, res: Response) => {
  try {
    const projectId = String(req.params.projectId);
    const result = await service.getByProject(projectId);
    return res.json(result);
  } catch (err) {
    console.error("FETCH TASKS ERROR:", err);
    return res.status(500).json({ message: "Error fetching tasks" });
  }
};

// UPDATE
export const updateTask = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const result = await service.updateTask(id, req.body);
    return res.json(result);
  } catch (err) {
    console.error("UPDATE TASK ERROR:", err);
    return res.status(500).json({ message: "Error updating task" });
  }
};

// DELETE
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await service.deleteTask(id);
    return res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE TASK ERROR:", err);
    return res.status(500).json({ message: "Error deleting task" });
  }
};