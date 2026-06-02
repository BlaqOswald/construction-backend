import { Router } from "express";
import * as controller from "./tasks.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { allowRoles } from "../../middleware/role.middleware";

const router = Router();

/* ================= TASKS ================= */

router.post(
  "/",
  authMiddleware,
  allowRoles(["admin", "manager"]),
  controller.createTask
);

router.get(
  "/project/:projectId",
  authMiddleware,
  allowRoles(["admin", "manager", "client"]),
  controller.getByProject
);

router.put(
  "/:id",
  authMiddleware,
  allowRoles(["admin", "manager"]),
  controller.updateTask
);

router.delete(
  "/:id",
  authMiddleware,
  allowRoles(["admin"]),
  controller.deleteTask
);

/* ================= TASK LOGS ================= */

// NOTE: specific routes (/logs/...) must come BEFORE the wildcard (/:id)

router.post(
  "/logs",
  authMiddleware,
  allowRoles(["admin", "manager"]),
  controller.addTaskLog
);

// GET all logs for a project
router.get(
  "/logs/:projectId",
  authMiddleware,
  allowRoles(["admin", "manager", "client"]),
  controller.getTaskLogs
);

// UPDATE a single log entry
router.put(
  "/logs/:id",
  authMiddleware,
  allowRoles(["admin", "manager"]),
  controller.updateTaskLog
);

// DELETE a single log entry
router.delete(
  "/logs/:id",
  authMiddleware,
  allowRoles(["admin", "manager"]),
  controller.deleteTaskLog
);
router.get("/project/:projectId", authMiddleware, controller.getByProject);

export default router;

