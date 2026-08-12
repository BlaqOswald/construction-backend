import { Router } from "express";

import {
  createSupplier,
  getSuppliersByProject,
  addDelivery,
  addPayment,
  updateSupplier,
  deleteSupplier,
  updateDelivery,
  deleteDelivery,
  payDelivery,
  bulkPayment,
  addAdvance
} from "./suppliers.controller";
import { validateUuidParam } from "../../middleware/validate";

const router = Router();

// SUPPLIERS
router.post("/", createSupplier);

router.get(
  "/project/:projectId",
  validateUuidParam("projectId"),
  getSuppliersByProject
);

router.put("/:id", updateSupplier);

router.delete("/:id", deleteSupplier);

// DELIVERIES
router.post("/delivery", addDelivery);

router.put("/delivery/:id", updateDelivery);

router.delete("/delivery/:id", deleteDelivery);

router.post("/delivery/pay", payDelivery);

// PAYMENTS
router.post("/payment", addPayment);

router.post("/payment/bulk", bulkPayment);

router.post("/advance", addAdvance);

export default router;