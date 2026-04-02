console.log("🔥 ACTIVITY ROUTES LOADED");
import { Router } from "express";
import * as controller from "../controllers/activity.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/", verifyToken, controller.createActivity);
router.get("/", verifyToken, controller.getActivities);
router.get("/project/:project_id", verifyToken, controller.getActivitiesByProject);

// ✅ correct function name
router.patch("/:id", verifyToken, controller.updateActivityStatus);

export default router;
