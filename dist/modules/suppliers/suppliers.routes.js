"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const suppliers_controller_1 = require("./suppliers.controller");
const validate_1 = require("../../middleware/validate");
const router = (0, express_1.Router)();
// SUPPLIERS
router.post("/", suppliers_controller_1.createSupplier);
router.get("/project/:projectId", (0, validate_1.validateUuidParam)("projectId"), suppliers_controller_1.getSuppliersByProject);
router.put("/:id", suppliers_controller_1.updateSupplier);
router.delete("/:id", suppliers_controller_1.deleteSupplier);
// DELIVERIES
router.post("/delivery", suppliers_controller_1.addDelivery);
router.put("/delivery/:id", suppliers_controller_1.updateDelivery);
router.delete("/delivery/:id", suppliers_controller_1.deleteDelivery);
router.post("/delivery/pay", suppliers_controller_1.payDelivery);
// PAYMENTS
router.post("/payment", suppliers_controller_1.addPayment);
router.post("/payment/bulk", suppliers_controller_1.bulkPayment);
router.post("/advance", suppliers_controller_1.addAdvance);
exports.default = router;
