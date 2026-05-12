import { Router } from "express";
import * as controller from "./subcontractors.controller";

const router = Router();

router.post("/", controller.addSubcontractor);
router.get("/project/:projectId", controller.getByProject);

// ❌ OLD (wrong)
// router.delete("/:id", controller.deleteSubcontractor);

// ✅ FIXED (correct name)
router.delete("/:id", controller.deleteSub);

router.put("/:id/payment", controller.addPayment);

export default router;