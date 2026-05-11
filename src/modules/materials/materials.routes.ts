import { Router } from "express";
import * as controller from "./materials.controller";

import { verifyToken } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

const router = Router();

router.post("/", verifyToken, controller.addMaterial);

router.get("/projects/:projectId", verifyToken, controller.getByProject);

router.put("/:id", verifyToken, controller.updateMaterial);

router.delete("/:id", verifyToken, requireRole("admin"), controller.deleteMaterial);

export default router;