import { Request, Response } from "express";
import * as service from "../services/activity.service";

// CREATE
export const createActivity = async (req: Request, res: Response) => {
  try {
    const activity = await service.createActivity(req.body);
    res.status(201).json(activity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating activity" });
  }
};

// GET ALL
export const getActivities = async (_req: Request, res: Response) => {
  try {
    const activities = await service.getActivities();
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching activities" });
  }
};

// GET BY PROJECT
export const getActivitiesByProject = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.project_id as string;
    const activities = await service.getActivitiesByProject(projectId);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching project activities" });
  }
};

// 🔥 UPDATE STATUS
export const updateActivityStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    const updated = await service.updateActivityStatus(id, status);

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating activity" });
  }
};
