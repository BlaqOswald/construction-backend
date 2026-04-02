import { Router } from "express";
import * as controller from "../controllers/dailylog.controller";
import { validateDto } from "../middleware/validate";
import { CreateDailyLogDto } from "../dto/create-dailylog.dto";

const router = Router();

router.post("/", validateDto(CreateDailyLogDto), controller.createDailyLog);
router.get("/", controller.getDailyLogs);

export default router;
