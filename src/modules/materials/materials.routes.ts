import { Router } from "express";
import * as controller from "./materials.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { allowRoles } from "../../middleware/role.middleware";
import { validateUuidParam } from "../../middleware/validate";

const router = Router();

/**
 * =========================
 * MATERIAL ROUTES (RBAC)
 * =========================
 */

/**
 * CREATE / UPSERT MATERIAL
 * Admin + Manager only
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
  validateUuidParam("projectId"),
  controller.getByProject
);

/**
 * UPDATE MATERIAL
 * Admin + Manager only
 */
router.put(
  "/:id",
  authMiddleware,
  allowRoles(["admin", "manager"]),
  controller.updateMaterial
);

/**
 * DELETE MATERIAL
 * Admin only
 */
router.delete(
  "/:id",
  authMiddleware,
  allowRoles(["admin"]),
  controller.deleteMaterial
);

export default router;
