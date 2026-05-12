import { Router } from "express";
import * as controller from "./materials.controller";

import { verifyToken } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

const router = Router();

// CREATE (open to all users)
router.post("/", verifyToken, controller.addMaterial);

// ✅ FIXED: remove "projects" typo → use "project"
router.get("/project/:projectId", verifyToken, controller.getByProject);

// UPDATE (open to all users)
router.put("/:id", verifyToken, controller.updateMaterial);

// DELETE (you said remove restrictions → remove admin-only)
router.delete("/:id", verifyToken, controller.deleteMaterial);

export default router;