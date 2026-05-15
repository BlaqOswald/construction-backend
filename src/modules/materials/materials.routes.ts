import { Router } from "express";
import * as controller from "./materials.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { allowRoles } from "../../middleware/role.middleware";

const router = Router();

/**
 * =========================
 * MATERIAL ROUTES (RBAC)
 * =========================
 */

/**
 * CREATE MATERIAL
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
 * Admin + Manager + Client
 *
 * Client is read-only.
 * Controller should verify project access.
 */
router.get(
  "/project/:projectId",
  authMiddleware,
  allowRoles(["admin", "manager", "client"]),
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