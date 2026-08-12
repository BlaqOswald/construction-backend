"use strict";
// suppliers.controller.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkPayment = exports.payDelivery = exports.deleteDelivery = exports.updateDelivery = exports.deleteSupplier = exports.updateSupplier = exports.addPayment = exports.addDelivery = exports.addAdvance = exports.getSuppliersByProject = exports.createSupplier = void 0;
const suppliers_service_1 = require("./suppliers.service");
// ======================
// CREATE SUPPLIER
// ======================
const createSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const supplier = yield (0, suppliers_service_1.createSupplierService)(req.body);
        res.json(supplier);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Create supplier failed" });
    }
});
exports.createSupplier = createSupplier;
// ======================
// GET SUPPLIERS BY PROJECT
// ======================
const getSuppliersByProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectId = String(req.params.projectId);
        const data = yield (0, suppliers_service_1.getSuppliersByProjectService)(projectId);
        res.json(data);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Fetch suppliers failed" });
    }
});
exports.getSuppliersByProject = getSuppliersByProject;
// ======================
// ADD ADVANCE (DEPOSIT BEFORE PURCHASE)
// POST body: { supplier_id, amount, deposit_date, note }
// ======================
const addAdvance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const advance = yield (0, suppliers_service_1.addAdvanceService)(req.body);
        res.json(advance);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Add advance failed" });
    }
});
exports.addAdvance = addAdvance;
// ======================
// ADD DELIVERY
// ======================
const addDelivery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const delivery = yield (0, suppliers_service_1.addDeliveryService)(req.body);
        res.json(delivery);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Add delivery failed" });
    }
});
exports.addDelivery = addDelivery;
// ======================
// ADD PAYMENT
// ======================
const addPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payment = yield (0, suppliers_service_1.addPaymentService)(req.body);
        res.json(payment);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Add payment failed" });
    }
});
exports.addPayment = addPayment;
// ======================
// UPDATE SUPPLIER
// ======================
const updateSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = String(req.params.id);
        const supplier = yield (0, suppliers_service_1.updateSupplierService)(id, req.body);
        res.json(supplier);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Update supplier failed" });
    }
});
exports.updateSupplier = updateSupplier;
// ======================
// DELETE SUPPLIER
// ======================
const deleteSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = String(req.params.id);
        const supplier = yield (0, suppliers_service_1.deleteSupplierService)(id);
        res.json(supplier);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Delete supplier failed" });
    }
});
exports.deleteSupplier = deleteSupplier;
// ======================
// UPDATE DELIVERY
// ======================
const updateDelivery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = String(req.params.id);
        const result = yield (0, suppliers_service_1.updateDeliveryService)(id, req.body);
        res.json(result);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Update delivery failed" });
    }
});
exports.updateDelivery = updateDelivery;
// ======================
// DELETE DELIVERY
// ======================
const deleteDelivery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = String(req.params.id);
        const result = yield (0, suppliers_service_1.deleteDeliveryService)(id);
        res.json(result);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Delete delivery failed" });
    }
});
exports.deleteDelivery = deleteDelivery;
// ======================
// PAY DELIVERY
// ======================
const payDelivery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, suppliers_service_1.payDeliveryService)(req.body);
        res.json(result);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Payment failed" });
    }
});
exports.payDelivery = payDelivery;
// ======================
// BULK PAYMENT
// ======================
const bulkPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, suppliers_service_1.bulkPaymentService)(req.body);
        res.json(result);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Bulk payment failed" });
    }
});
exports.bulkPayment = bulkPayment;
