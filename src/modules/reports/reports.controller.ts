import { Request, Response } from "express";
import * as service from "./reports.service";

export const getReport = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.projectId;

    // ✅ safety check (fixes TS error + runtime safety)
    if (Array.isArray(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    const result = await service.getReport(projectId);
    res.json(result);
  } catch (err) {
    console.error("REPORT ERROR:", err);
    res.status(500).json({ message: "Error generating report" });
  }
};
