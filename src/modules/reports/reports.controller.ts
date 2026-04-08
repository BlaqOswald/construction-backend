import { Request, Response } from "express";
import * as service from "./reports.service";

export const getReport = async (req: Request, res: Response) => {
  try {
    const result = await service.getReport(req.params.projectId);
    res.json(result);
  } catch (err) {
    console.error("REPORT ERROR:", err);
    res.status(500).json({ message: "Error generating report" });
  }
};
