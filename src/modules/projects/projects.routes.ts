import { Router } from "express";
import * as controller from "./projects.controller";

const router = Router();

router.post("/", controller.createProject);
router.get("/", controller.getProjects);
router.get("/:id", controller.getProject);
router.patch("/:id/lock", controller.lockProject);

export default router;
