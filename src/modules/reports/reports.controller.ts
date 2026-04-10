import { Request, Response } from "express";
import * as service from "./reports.service";

export const getReport = async (req: Request, res: Response) => {
  try {
    // ✅ SAFE EXTRACTION (fixes TS error)
    const projectIdParam = req.params.projectId;

    // ensure it's a string
    const projectId = Array.isArray(projectIdParam)
      ? projectIdParam[0]
      : projectIdParam;

    // optional safety check
    if (!projectId) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    const result = await service.getReport(projectId);

    res.json(result);
  } catch (err) {
    console.error("REPORT ERROR:", err);
    res.status(500).json({ message: "Error generating report" });
  }
};