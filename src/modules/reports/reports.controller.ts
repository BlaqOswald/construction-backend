import { Request, Response } from "express";
import * as service from "./reports.service";

export const getReport = (req: Request, res: Response) => {
  const projectId = req.params.projectId as string;

  const report = service.getReport(projectId);

  res.json(report);
};
