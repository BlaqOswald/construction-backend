import { Router } from "express";
import * as controller from "./siteoverheads.controller";
import {
  createOverhead,
  getProjectOverheads,
  updateOverhead,
  deleteOverhead,
  addPaymentHistory,
} from "./siteoverheads.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { allowRoles } from "../../middleware/role.middleware";

const router = Router();

router.get("/project/:projectId", getProjectOverheads);

router.post("/", createOverhead);

router.put("/:id", updateOverhead);

router.delete("/:id", deleteOverhead);

router.post("/:id/payment", addPaymentHistory);
router.get("/project/:projectId", authMiddleware, controller.getProjectOverheads);

export default router;