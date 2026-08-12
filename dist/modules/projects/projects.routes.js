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
const controller = __importStar(require("./projects.controller"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const role_middleware_1 = require("../../middleware/role.middleware");
const validate_1 = require("../../middleware/validate");
const router = (0, express_1.Router)();
/**
 * CREATE PROJECT
 * Admin + Manager only
 */
router.post("/", auth_middleware_1.authMiddleware, (0, role_middleware_1.allowRoles)(["admin", "manager"]), controller.createProject);
/**
 * GET ALL PROJECTS
 * Admin + Manager + Client
 *
 * NOTE:
 * Client filtering happens inside controller.getProjects
 * using req.user.projectIds
 */
router.get("/", auth_middleware_1.authMiddleware, (0, role_middleware_1.allowRoles)(["admin", "manager", "client"]), controller.getProjects);
/**
 * GET SINGLE PROJECT
 * Admin + Manager + Client
 *
 * NOTE:
 * Controller should verify client owns project
 */
router.get("/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.allowRoles)(["admin", "manager", "client"]), (0, validate_1.validateUuidParam)("id"), controller.getProject);
/**
 * UPDATE PROJECT
 * Admin + Manager only
 */
router.put("/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.allowRoles)(["admin", "manager"]), controller.updateProject);
/**
 * DELETE PROJECT
 * Admin only
 */
router.delete("/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.allowRoles)(["admin"]), controller.deleteProject);
/**
 * LOCK PROJECT
 * Admin only
 */
router.patch("/:id/lock", auth_middleware_1.authMiddleware, (0, role_middleware_1.allowRoles)(["admin"]), controller.lockProject);
exports.default = router;
