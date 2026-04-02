import { Request, Response } from "express";
import * as service from "../services/dailylog.service";

export const createDailyLog = async (req: Request, res: Response) => {
  try {
    const log = await service.createDailyLog(req.body);
    res.status(201).json(log);
  } catch (err: any) {
    const status = err.status ?? 500;
    const message = err.message ?? "Failed to create daily log";
    res.status(status).json({ message });
  }
};

export const getDailyLogs = async (req: Request, res: Response) => {
  try {
    const activityId = req.query.activityId as string | undefined;
    const logs = await service.getDailyLogs(activityId);
    res.json(logs);
  } catch (err) {
    console.error("[DailyLogController] error:", err);
    res.status(500).json({ message: "Failed to fetch daily logs" });
  }
};
