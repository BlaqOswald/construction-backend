import { Router } from "express";
import * as controller from "./materials.controller";

// 🔥 IMPORT THESE
import { verifyToken } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

const router = Router();

// CREATE
router.post("/", verifyToken, controller.addMaterial);

// READ
router.get("/project/:projectId", verifyToken, controller.getByProject);

// UPDATE
router.put("/:id", verifyToken, controller.updateMaterial);

// DELETE (ADMIN ONLY 🔥)
router.delete(
  "/:id",
  verifyToken,
  requireRole("admin"),
  controller.deleteMaterial
);

export default router;
