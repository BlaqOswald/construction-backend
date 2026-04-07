import { Router } from "express";
import * as controller from "./materials.controller";

const router = Router();

router.post("/", controller.addMaterial);
router.get("/:taskId", controller.getMaterials);

export default router;
