import { Router } from "express";
import * as controller from "./subcontractors.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { allowRoles } from "../../middleware/role.middleware";

const router = Router();

/**
 * =========================
 * SUBCONTRACTOR ROUTES (RBAC)
 * =========================
 */

/**
 * CREATE SUBCONTRACTOR
 * Admin + Manager only
 */
router.post(
  "/",
  authMiddleware,
  allowRoles(["admin", "manager"]),
  controller.addSubcontractor
);

/**
 * GET SUBCONTRACTORS BY PROJECT
 * Admin + Manager + Client (read-only)
 *
 * IMPORTANT:
 * Controller must enforce project ownership check
 */
router.get(
  "/project/:projectId",
  authMiddleware,
  allowRoles(["admin", "manager", "client"]),
  controller.getByProject
);

/**
 * DELETE SUBCONTRACTOR
 * Admin only (safe rule)
 */
router.delete(
  "/:id",
  authMiddleware,
  allowRoles(["admin"]),
  controller.deleteSub
);

/**
 * ADD PAYMENT
 * Admin + Manager only
 */
router.put(
  "/:id/payment",
  authMiddleware,
  allowRoles(["admin", "manager"]),
  controller.addPayment
);

export default router;