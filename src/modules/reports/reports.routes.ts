import { Router } from "express";
import { getReport } from "./reports.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { allowRoles } from "../../middleware/role.middleware";

const router = Router();

/**
 * =========================
 * REPORT ROUTES (RBAC)
 * =========================
 */

/**
 * GET PROJECT REPORT
 * Admin + Manager + Client
 *
 * Client is read-only.
 * Controller should verify client is assigned
 * to requested project.
 */
router.get(
  "/:projectId",
  authMiddleware,
  allowRoles(["admin", "manager", "client"]),
  getReport
);

export default router;