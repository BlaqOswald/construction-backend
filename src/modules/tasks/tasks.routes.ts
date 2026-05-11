import { Router } from "express";
import * as controller from "./tasks.controller";

const router = Router();

// CREATE
router.post("/", controller.createTask);

// READ BY PROJECT
router.get("/project/:projectId", controller.getByProject);

// UPDATE
router.put("/:id", controller.updateTask);

// DELETE
router.delete("/:id", controller.deleteTask);

export default router;