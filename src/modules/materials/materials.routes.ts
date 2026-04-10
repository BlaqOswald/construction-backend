import { Router } from "express";
import * as controller from "./materials.controller";

const router = Router();

router.post("/", controller.addMaterial);

// 🔥 IMPORTANT ORDER
router.get("/projects/:projectId/materials", controller.getByProject);
router.get("/:taskId", controller.getMaterials);

export default router;
