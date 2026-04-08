import { Router } from "express";
import * as controller from "./materials.controller";

const router = Router();

// add material
router.post("/", controller.addMaterial);

// get materials for task
router.get("/:taskId", controller.getMaterials);

export default router;
