"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.updateSub = exports.addPayment = exports.deleteSub = exports.getByProject = exports.addSubcontractor = void 0;
const service = __importStar(require("./subcontractors.service"));
// SAFE ID FIX
const getId = (val) => Array.isArray(val) ? val[0] : val;
// ================= CREATE =================
const addSubcontractor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield service.addSubcontractor(req.body);
        res.json(result);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Create failed" });
    }
});
exports.addSubcontractor = addSubcontractor;
// ================= GET =================
const getByProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectId = getId(req.params.projectId);
        const result = yield service.getByProject(projectId);
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ message: "Fetch failed" });
    }
});
exports.getByProject = getByProject;
// ================= DELETE =================
const deleteSub = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = getId(req.params.id);
        yield service.deleteSubcontractor(id);
        res.json({ message: "Deleted" });
    }
    catch (err) {
        res.status(500).json({ message: "Delete failed" });
    }
});
exports.deleteSub = deleteSub;
// ================= PAYMENT =================
const addPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = getId(req.params.id);
        const result = yield service.addPayment(id, req.body);
        res.json(result);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Payment failed" });
    }
});
exports.addPayment = addPayment;
const updateSub = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = getId(req.params.id);
        const result = yield service.updateSubcontractor(id, req.body);
        res.json(result);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Update failed" });
    }
});
exports.updateSub = updateSub;
