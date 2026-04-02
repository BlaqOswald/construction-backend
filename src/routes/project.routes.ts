import { Router } from "express";
import * as controller from "../controllers/project.controller";
import { Request, Response, NextFunction } from "express";
import { requireRole } from "../middleware/role.middleware";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/", verifyToken, controller.createProject);
router.get("/", verifyToken, controller.getProjects);
router.get(
  "/admin",
  verifyToken,
  requireRole("admin"),
  (req, res) => {
    res.json({ message: "Welcome Admin 🔥 You can see all projects" });
  }
);
export default router;
