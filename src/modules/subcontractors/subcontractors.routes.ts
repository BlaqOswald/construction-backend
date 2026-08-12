import { Router } from "express";
import * as controller from "./subcontractors.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { allowRoles } from "../../middleware/role.middleware";
import { validateUuidParam } from "../../middleware/validate";

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


router.get(
  "/project/:projectId",
  authMiddleware,
  allowRoles(["admin", "manager", "client"]),
  validateUuidParam("projectId"),
  controller.getByProject
);

router.put(
  "/:id",
  authMiddleware,
  allowRoles(["admin", "manager"]),
  controller.updateSub
);

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