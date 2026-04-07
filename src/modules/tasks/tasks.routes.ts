import { Router } from "express";
import * as controller from "./tasks.controller";

const router = Router();

router.post("/", controller.createTask);
router.get("/:projectId", controller.getTasks);

export default router;
