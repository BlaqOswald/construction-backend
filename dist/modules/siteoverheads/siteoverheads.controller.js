"use strict";
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
exports.addPaymentHistory = exports.deleteOverhead = exports.updateOverhead = exports.getProjectOverheads = exports.createOverhead = void 0;
const siteoverheads_service_1 = require("./siteoverheads.service");
// ======================
// SAFE PARAM HELPER
// ======================
const getParam = (param) => {
    if (!param)
        return "";
    return Array.isArray(param) ? param[0] : param;
};
// ======================
// CREATE OVERHEAD
// ======================
const createOverhead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, siteoverheads_service_1.addSiteOverhead)(req.body);
        res.json(data);
    }
    catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});
exports.createOverhead = createOverhead;
// ======================
// GET PROJECT OVERHEADS
// ======================
const getProjectOverheads = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectId = getParam(req.params.projectId);
        const data = yield (0, siteoverheads_service_1.getByProject)(projectId);
        res.json(data);
    }
    catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});
exports.getProjectOverheads = getProjectOverheads;
// ======================
// UPDATE OVERHEAD
// ======================
const updateOverhead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = getParam(req.params.id);
        const data = yield (0, siteoverheads_service_1.updateSiteOverhead)(id, req.body);
        res.json(data);
    }
    catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});
exports.updateOverhead = updateOverhead;
// ======================
// DELETE OVERHEAD
// ======================
const deleteOverhead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = getParam(req.params.id);
        const data = yield (0, siteoverheads_service_1.deleteSiteOverhead)(id);
        res.json(data);
    }
    catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});
exports.deleteOverhead = deleteOverhead;
// ======================
// ADD PAYMENT HISTORY
// ======================
const addPaymentHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = getParam(req.params.id);
        const data = yield (0, siteoverheads_service_1.addPayment)(id, req.body);
        res.json(data);
    }
    catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});
exports.addPaymentHistory = addPaymentHistory;
