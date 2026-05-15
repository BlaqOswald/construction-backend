import { Router } from "express";
import * as controller from "./tasks.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { allowRoles } from "../../middleware/role.middleware";

const router = Router();

/**
 * =========================
 * TASK ROUTES (RBAC)
 * =========================
 */

/**
 * CREATE TASK
 * Admin + Manager only
 */
router.post(
  "/",
  authMiddleware,
  allowRoles(["admin", "manager"]),
  controller.createTask
);

/**
 * GET TASKS BY PROJECT
 * Admin + Manager + Client (read-only)
 *
 * IMPORTANT:
 * Controller must enforce project access check
 */
router.get(
  "/project/:projectId",
  authMiddleware,
  allowRoles(["admin", "manager", "client"]),
  controller.getByProject
);

/**
 * UPDATE TASK
 * Admin + Manager only
 */
router.put(
  "/:id",
  authMiddleware,
  allowRoles(["admin", "manager"]),
  controller.updateTask
);

/**
 * DELETE TASK
 * Admin only (strict rule)
 */
router.delete(
  "/:id",
  authMiddleware,
  allowRoles(["admin"]),
  controller.deleteTask
);

export default router;