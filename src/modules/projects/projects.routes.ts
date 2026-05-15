import { Router } from "express";
import * as controller from "./projects.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { allowRoles } from "../../middleware/role.middleware";

const router = Router();

/**
 * CREATE PROJECT
 * Admin + Manager only
 */
router.post(
  "/",
  authMiddleware,
  allowRoles(["admin", "manager"]),
  controller.createProject
);

/**
 * GET ALL PROJECTS
 * Admin + Manager + Client
 *
 * NOTE:
 * Client filtering happens inside controller.getProjects
 * using req.user.projectIds
 */
router.get(
  "/",
  authMiddleware,
  allowRoles(["admin", "manager", "client"]),
  controller.getProjects
);

/**
 * GET SINGLE PROJECT
 * Admin + Manager + Client
 *
 * NOTE:
 * Controller should verify client owns project
 */
router.get(
  "/:id",
  authMiddleware,
  allowRoles(["admin", "manager", "client"]),
  controller.getProject
);

/**
 * UPDATE PROJECT
 * Admin + Manager only
 */
router.put(
  "/:id",
  authMiddleware,
  allowRoles(["admin", "manager"]),
  controller.updateProject
);

/**
 * DELETE PROJECT
 * Admin only
 */
router.delete(
  "/:id",
  authMiddleware,
  allowRoles(["admin"]),
  controller.deleteProject
);

/**
 * LOCK PROJECT
 * Admin only
 */
router.patch(
  "/:id/lock",
  authMiddleware,
  allowRoles(["admin"]),
  controller.lockProject
);

export default router;