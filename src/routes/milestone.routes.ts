import { Router } from "express";
import * as controller from "../controllers/milestone.controller";
import { validateDto } from "../middleware/validate";
import { CreateMilestoneDto } from "../dto/create-milestone.dto";

const router = Router();

router.post("/", validateDto(CreateMilestoneDto), controller.createMilestone);
router.get("/", controller.getMilestones);

export default router;
