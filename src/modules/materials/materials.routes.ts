import { Router } from "express";
import * as controller from "./materials.controller";

const router = Router();

router.post("/", controller.addMaterial);
router.get("/project/:projectId", controller.getByProject);
router.delete("/:id", controller.deleteMaterial);
router.put("/:id", controller.updateMaterial);

export default router;
