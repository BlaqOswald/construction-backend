import { Router } from "express";
import * as controller from "./tasks.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { allowRoles } from "../../middleware/role.middleware";

const router = Router();

/* ================= TASKS ================= */

// CREATE
router.post(
  "/",
  authMiddleware,
  allowRoles(["admin", "manager"]),
  controller.createTask
);

// GET BY PROJECT
router.get(
  "/project/:projectId",
  authMiddleware,
  allowRoles(["admin", "manager", "client"]),
  controller.getByProject
);

// UPDATE
router.put(
  "/:id",
  authMiddleware,
  allowRoles(["admin", "manager"]),
  controller.updateTask
);

// DELETE
router.delete(
  "/:id",
  authMiddleware,
  allowRoles(["admin"]),
  controller.deleteTask
);

/* ================= TASK LOGS ================= */

// ADD DAILY ENTRY
router.post(
  "/logs",
  authMiddleware,
  allowRoles(["admin", "manager"]),
  controller.addTaskLog
);

// GET LOGS
router.get(
  "/logs/:taskId",
  authMiddleware,
  allowRoles(["admin", "manager", "client"]),
  controller.getTaskLogs
);



export default router;