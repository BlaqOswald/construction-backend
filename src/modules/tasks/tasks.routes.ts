import { Router } from "express";
import * as controller from "./tasks.controller";

const router = Router();

// CREATE TASK
router.post("/", controller.addTask);

// GET TASKS BY PROJECT
router.get("/projects/:projectId", controller.getTasksByProject);

// GET TASK BY ID
router.get("/:taskId", controller.getTaskById);
router.delete("/:id", controller.deleteTask);
export default router;
