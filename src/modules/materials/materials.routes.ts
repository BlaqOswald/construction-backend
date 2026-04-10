import { Router } from "express";
import * as controller from "./materials.controller";

const router = Router();

router.post("/", controller.addMaterial);

// BY TASK (IMPORTANT FOR UI)
router.get("/task/:taskId", controller.getMaterials);

// BY PROJECT (optional dashboard)
router.get("/project/:projectId", controller.getByProject);

export default router;