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
} from "./suppliers.controller";

const router = Router();

// SUPPLIERS
router.post("/", createSupplier);

router.get(
  "/project/:projectId",
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

export default router;