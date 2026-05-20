import { Router } from "express";

import {
  createSupplier,
  getSuppliersByProject,
  addDelivery,
  addPayment,
  updateSupplier,
  deleteSupplier,
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

// PAYMENTS
router.post("/payment", addPayment);

export default router;