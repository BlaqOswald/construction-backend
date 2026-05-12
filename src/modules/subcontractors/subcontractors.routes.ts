import { Router } from "express";
import * as controller from "./subcontractors.controller";

const router = Router();

router.post("/", controller.addSubcontractor);
router.get("/project/:projectId", controller.getByProject);
router.delete("/:id", controller.deleteSub);

// 🔥 PAYMENT ROUTE
router.post("/payment", controller.addPayment);

export default router;