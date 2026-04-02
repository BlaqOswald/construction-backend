import { Router } from "express";
import * as controller from "../controllers/task.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

console.log("🔥 TASK ROUTES LOADED");

router.post("/", verifyToken, controller.createTask);
router.get("/", verifyToken, controller.getTasks);
router.get("/project/:project_id", verifyToken, controller.getTasksByProject);
router.patch("/:id", verifyToken, controller.updateStatus);

export default router;
