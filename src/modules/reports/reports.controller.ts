import { Request, Response } from "express";
import * as service from "./reports.service";

export const getReport = async (req: Request, res: Response) => {
  try {
    const projectIdParam = req.params.projectId;
    const month = req.query.month as string | undefined;

    const projectId = Array.isArray(projectIdParam)
      ? projectIdParam[0]
      : projectIdParam;

    if (!projectId) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    const result = await service.getReport(projectId, month);

    return res.json(result);
  } catch (err) {
    console.error("REPORT ERROR:", err);
    return res.status(500).json({ message: "Error generating report" });
  }
};