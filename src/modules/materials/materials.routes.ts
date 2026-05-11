import { Router } from "express";
import * as controller from "./materials.controller";
import { verifyToken } from "../../middleware/auth.middleware";

const router = Router();

// CREATE
router.post("/", verifyToken, controller.addMaterial);

// READ
router.get("/project/:projectId", verifyToken, controller.getByProject);

// UPDATE
router.put("/:id", verifyToken, controller.updateMaterial);

// DELETE
router.delete("/:id", verifyToken, controller.deleteMaterial);

export default router;