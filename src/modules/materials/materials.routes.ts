import { Router } from "express";
import * as controller from "./materials.controller";

import { authMiddleware } from "../../middleware/auth.middleware";
import { allowRoles } from "../../middleware/role.middleware";

const router = Router();

/**
 * CREATE MATERIAL
 * Admin + Manager
 */
router.post(
  "/",
  authMiddleware,
  allowRoles(["admin", "manager"]),
  controller.addMaterial
);

/**
 * GET MATERIALS BY PROJECT
 * Admin + Manager + Client (read-only)
 */
router.get(
  "/project/:projectId",
  authMiddleware,
  allowRoles(["admin", "manager", "client"]),
  controller.getByProject
);

/**
 * UPDATE MATERIAL
 * Admin + Manager
 */
router.put(
  "/:id",
  authMiddleware,
  allowRoles(["admin", "manager"]),
  controller.updateMaterial
);

/**
 * DELETE MATERIAL
 * Admin only (safer rule)
 */
router.delete(
  "/:id",
  authMiddleware,
  allowRoles(["admin"]),
  controller.deleteMaterial
);

export default router;