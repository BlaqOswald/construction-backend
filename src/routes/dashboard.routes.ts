console.log("🔥 DASHBOARD ROUTE LOADED");
import { Router } from "express";
import * as controller from "../controllers/dashboard.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router = Router();
router.get("/", verifyToken, (req, res) => {
  res.json({
    message: "General dashboard working 🚀",
    stats: {
      users: 1,
      projects: 2,
      tasks: 5,
    },
  });
});
router.get(
  "/:project_id",
  verifyToken,
  requireRole(["admin", "user"]),
  controller.getProjectDashboard
);

export default router;
