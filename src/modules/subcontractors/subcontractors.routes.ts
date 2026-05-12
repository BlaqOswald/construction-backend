import { Router } from "express";
import * as controller from "./subcontractors.controller";

const router = Router();

router.post("/", controller.addSubcontractor);
router.get("/project/:projectId", controller.getByProject);

// 🔥 PAYMENT FLOW (NEW BUT SAFE EXTENSION)
router.put("/:id/payment", controller.addPayment);

router.delete("/:id", controller.deleteSub);

export default router;