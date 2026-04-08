import { Router } from "express";
import * as controller from "./subcontractors.controller";

const router = Router();

router.post("/", controller.addSubcontractor);
router.get("/:taskId", controller.getByTask);

export default router;
