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
exports.deleteAttachment = exports.getAttachments = exports.addAttachment = exports.deleteCostItem = exports.updateCostItem = exports.getItemsByCategory = exports.addCostItem = exports.deleteCategory = exports.updateCategory = exports.getCategoriesByProject = exports.addCategory = void 0;
const service = __importStar(require("./predevelopment.service"));
// =============================
// CREATE CATEGORY
// =============================
const addCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.project_id) {
            return res.status(400).json({
                message: "project_id required",
            });
        }
        const result = yield service.addCategory(req.body);
        return res.status(201).json(result);
    }
    catch (err) {
        console.error("CATEGORY ADD ERROR:", err);
        return res.status(500).json({
            message: "Failed to add category",
            error: err instanceof Error
                ? err.message
                : err,
        });
    }
});
exports.addCategory = addCategory;
// =============================
// GET CATEGORIES BY PROJECT
// =============================
const getCategoriesByProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectId = String(req.params.projectId);
        const result = yield service.getCategoriesByProject(projectId);
        return res.json(result);
    }
    catch (err) {
        console.error("CATEGORY FETCH ERROR:", err);
        return res.status(500).json({
            message: "Failed to fetch categories",
            error: err instanceof Error
                ? err.message
                : err,
        });
    }
});
exports.getCategoriesByProject = getCategoriesByProject;
// =============================
// UPDATE CATEGORY
// =============================
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = String(req.params.id);
        const result = yield service.updateCategory(id, req.body);
        return res.json(result);
    }
    catch (err) {
        console.error("CATEGORY UPDATE ERROR:", err);
        return res.status(500).json({
            message: "Failed to update category",
            error: err,
        });
    }
});
exports.updateCategory = updateCategory;
// =============================
// DELETE CATEGORY
// =============================
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = String(req.params.id);
        const result = yield service.deleteCategory(id);
        return res.json(result);
    }
    catch (err) {
        console.error("CATEGORY DELETE ERROR:", err);
        return res.status(500).json({
            message: "Failed to delete category",
            error: err,
        });
    }
});
exports.deleteCategory = deleteCategory;
// =============================
// CREATE COST ITEM
// =============================
const addCostItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.category_id) {
            return res.status(400).json({
                message: "category_id required",
            });
        }
        const result = yield service.addCostItem(req.body);
        return res.status(201).json(result);
    }
    catch (err) {
        console.error("COST ITEM ADD ERROR:", err);
        return res.status(500).json({
            message: "Failed to add cost item",
            error: err instanceof Error
                ? err.message
                : err,
        });
    }
});
exports.addCostItem = addCostItem;
// =============================
// GET ITEMS BY CATEGORY
// =============================
const getItemsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = String(req.params.categoryId);
        const result = yield service.getItemsByCategory(categoryId);
        return res.json(result);
    }
    catch (err) {
        console.error("ITEM FETCH ERROR:", err);
        return res.status(500).json({
            message: "Failed to fetch items",
            error: err instanceof Error
                ? err.message
                : err,
        });
    }
});
exports.getItemsByCategory = getItemsByCategory;
// =============================
// UPDATE COST ITEM
// =============================
const updateCostItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = String(req.params.id);
        const result = yield service.updateCostItem(id, req.body);
        return res.json(result);
    }
    catch (err) {
        console.error("ITEM UPDATE ERROR:", err);
        return res.status(500).json({
            message: "Failed to update item",
            error: err,
        });
    }
});
exports.updateCostItem = updateCostItem;
// =============================
// DELETE COST ITEM
// =============================
const deleteCostItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = String(req.params.id);
        const result = yield service.deleteCostItem(id);
        return res.json(result);
    }
    catch (err) {
        console.error("ITEM DELETE ERROR:", err);
        return res.status(500).json({
            message: "Failed to delete item",
            error: err,
        });
    }
});
exports.deleteCostItem = deleteCostItem;
// =============================
// ADD ATTACHMENT
// =============================
const addAttachment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.cost_item_id) {
            return res.status(400).json({
                message: "cost_item_id required",
            });
        }
        const result = yield service.addAttachment(req.body);
        return res.status(201).json(result);
    }
    catch (err) {
        console.error("ATTACHMENT ADD ERROR:", err);
        return res.status(500).json({
            message: "Failed to add attachment",
            error: err instanceof Error
                ? err.message
                : err,
        });
    }
});
exports.addAttachment = addAttachment;
// =============================
// GET ATTACHMENTS
// =============================
const getAttachments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const costItemId = String(req.params.costItemId);
        const result = yield service.getAttachments(costItemId);
        return res.json(result);
    }
    catch (err) {
        console.error("ATTACHMENT FETCH ERROR:", err);
        return res.status(500).json({
            message: "Failed to fetch attachments",
            error: err instanceof Error
                ? err.message
                : err,
        });
    }
});
exports.getAttachments = getAttachments;
// =============================
// DELETE ATTACHMENT
// =============================
const deleteAttachment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = String(req.params.id);
        const result = yield service.deleteAttachment(id);
        return res.json(result);
    }
    catch (err) {
        console.error("ATTACHMENT DELETE ERROR:", err);
        return res.status(500).json({
            message: "Failed to delete attachment",
            error: err,
        });
    }
});
exports.deleteAttachment = deleteAttachment;
