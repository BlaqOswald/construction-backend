import { Router } from "express";

import {
  createOverhead,
  getProjectOverheads,
  updateOverhead,
  deleteOverhead,
  addPaymentHistory,
} from "./siteoverheads.controller";

const router = Router();

router.get("/project/:projectId", getProjectOverheads);

router.post("/", createOverhead);

router.put("/:id", updateOverhead);

router.delete("/:id", deleteOverhead);

router.post("/:id/payment", addPaymentHistory);

export default router;