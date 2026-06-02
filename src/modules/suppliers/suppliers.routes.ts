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
  bulkPayment
} from "./suppliers.controller";
import * as controller from "./suppliers.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { allowRoles } from "../../middleware/role.middleware";

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

router.post("/payment/bulk", bulkPayment);

router.get("/project/:projectId", authMiddleware, controller.getSuppliersByProject);

export default router;