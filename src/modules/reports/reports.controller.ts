import { Request, Response } from "express";
import * as service from "./reports.service";

export const getReport = async (req: Request, res: Response) => {
  try {
    const projectIdParam = req.params.projectId;

    const projectId = Array.isArray(projectIdParam)
      ? projectIdParam[0]
      : projectIdParam;

    const month = req.query.month as string | undefined;

    if (!projectId) {
      return res.status(400).json({
        message: "Project ID is required",
      });
    }

    const result = await service.getReport(projectId, month);

    return res.json(result);
  } catch (error) {
    console.error("REPORT ERROR:", error);

    return res.status(500).json({
      message: "Failed to generate report",
    });
  }
};