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
exports.deleteMaterial = exports.updateMaterial = exports.getByProject = exports.addMaterial = void 0;
const service = __importStar(require("./materials.service"));
// ======================
// CREATE / UPSERT
// ======================
const addMaterial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.project_id) {
            return res.status(400).json({ message: "project_id required" });
        }
        const result = yield service.addMaterial(req.body);
        return res.status(201).json(result);
    }
    catch (err) {
        console.error("ADD ERROR:", err);
        return res.status(500).json({
            message: "Failed to add material",
            error: err instanceof Error ? err.message : err,
        });
    }
});
exports.addMaterial = addMaterial;
// ======================
// GET BY PROJECT
// ======================
const getByProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectId = String(req.params.projectId);
        const result = yield service.getByProject(projectId);
        return res.json(result);
    }
    catch (err) {
        console.error("MATERIAL FETCH ERROR:", err);
        return res.status(500).json({
            message: "Failed to fetch materials",
            error: err instanceof Error ? err.message : err,
        });
    }
});
exports.getByProject = getByProject;
// ======================
// UPDATE
// ======================
const updateMaterial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = String(req.params.id);
        const result = yield service.updateMaterial(id, req.body);
        return res.json(result);
    }
    catch (err) {
        console.error("UPDATE ERROR:", err);
        return res.status(500).json({
            message: "Failed to update material",
            error: err,
        });
    }
});
exports.updateMaterial = updateMaterial;
// ======================
// DELETE
// ======================
const deleteMaterial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = String(req.params.id);
        const result = yield service.deleteMaterial(id);
        return res.json(result);
    }
    catch (err) {
        console.error("DELETE ERROR:", err);
        return res.status(500).json({
            message: "Failed to delete material",
            error: err,
        });
    }
});
exports.deleteMaterial = deleteMaterial;
