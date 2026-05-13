console.log("🔥 DASHBOARD ROUTE LOADED");

import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { allowRoles } from "../middleware/role.middleware";

import * as controller from "../controllers/dashboard.controller";

const router = Router();

/**
 * GENERAL DASHBOARD (all logged-in users)
 */
router.get(
  "/",
  authMiddleware,
  allowRoles(["admin", "manager", "client"]),
  (req, res) => {
    res.json({
      message: "General dashboard working 🚀",
      stats: {
        users: 1,
        projects: 2,
        tasks: 5,
      },
    });
  }
);

/**
 * PROJECT DASHBOARD (role-based access)
 */
router.get(
  "/:project_id",
  authMiddleware,
  allowRoles(["admin", "manager", "client"]),
  controller.getProjectDashboard
);

export default router;