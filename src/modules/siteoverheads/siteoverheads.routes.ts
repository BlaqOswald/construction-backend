import { Router } from "express";

import {
  createOverhead,
  getProjectOverheads,
  updateOverhead,
  deleteOverhead,
  addPaymentHistory,
} from "./siteoverheads.controller";
import { validateUuidParam } from "../../middleware/validate";

const router = Router();

router.get("/project/:projectId", validateUuidParam("projectId"), getProjectOverheads);

router.post("/", createOverhead);

router.put("/:id", updateOverhead);

router.delete("/:id", deleteOverhead);

router.post("/:id/payment", addPaymentHistory);

export default router;