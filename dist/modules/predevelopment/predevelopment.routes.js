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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller = __importStar(require("./predevelopment.controller"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const role_middleware_1 = require("../../middleware/role.middleware");
const validate_1 = require("../../middleware/validate");
const router = (0, express_1.Router)();
// =============================
// CATEGORY ROUTES
// =============================
router.post("/categories", auth_middleware_1.authMiddleware, (0, role_middleware_1.allowRoles)(["admin", "manager"]), controller.addCategory);
router.get("/categories/project/:projectId", auth_middleware_1.authMiddleware, (0, role_middleware_1.allowRoles)([
    "admin",
    "manager",
    "client",
]), (0, validate_1.validateUuidParam)("projectId"), controller.getCategoriesByProject);
router.put("/categories/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.allowRoles)(["admin", "manager"]), controller.updateCategory);
router.delete("/categories/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.allowRoles)(["admin"]), controller.deleteCategory);
// =============================
// COST ITEM ROUTES
// =============================
router.post("/items", auth_middleware_1.authMiddleware, (0, role_middleware_1.allowRoles)(["admin", "manager"]), controller.addCostItem);
router.get("/items/category/:categoryId", auth_middleware_1.authMiddleware, (0, role_middleware_1.allowRoles)([
    "admin",
    "manager",
    "client",
]), controller.getItemsByCategory);
router.put("/items/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.allowRoles)(["admin", "manager"]), controller.updateCostItem);
router.delete("/items/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.allowRoles)(["admin"]), controller.deleteCostItem);
// =============================
// ATTACHMENT ROUTES
// =============================
router.post("/attachments", auth_middleware_1.authMiddleware, (0, role_middleware_1.allowRoles)(["admin", "manager"]), controller.addAttachment);
router.get("/attachments/:costItemId", auth_middleware_1.authMiddleware, (0, role_middleware_1.allowRoles)([
    "admin",
    "manager",
    "client",
]), controller.getAttachments);
router.delete("/attachments/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.allowRoles)(["admin"]), controller.deleteAttachment);
exports.default = router;
