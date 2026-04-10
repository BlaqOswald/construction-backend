import { Router } from "express";
import { getReport } from "./reports.controller";

const router = Router();

router.get("/:projectId", getReport);

export default router;