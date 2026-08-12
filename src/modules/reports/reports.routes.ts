import { Router } from "express";
import { getReport } from "./reports.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { allowRoles } from "../../middleware/role.middleware";
import { validateUuidParam } from "../../middleware/validate";

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
  validateUuidParam("projectId"),
  getReport
);

export default router;
