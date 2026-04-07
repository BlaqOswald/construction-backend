import { Router } from "express";
import * as controller from "./reports.controller";

const router = Router();

router.get("/project/:projectId", controller.getReport);

export default router;
