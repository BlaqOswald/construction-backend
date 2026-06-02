import { Router } from "express";
import { getReport } from "./reports.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { allowRoles } from "../../middleware/role.middleware";

const router = Router();

/**
 * GET /reports/:projectId
 * GET /reports/:projectId?month=2026-03
 *
 * Roles: admin, manager, client (read-only)
 */
router.get(
  "/:projectId",
  authMiddleware,
  allowRoles(["admin", "manager", "client"]),
  getReport
);

export default router;
