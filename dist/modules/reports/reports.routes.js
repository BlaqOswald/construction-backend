"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reports_controller_1 = require("./reports.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const role_middleware_1 = require("../../middleware/role.middleware");
const validate_1 = require("../../middleware/validate");
const router = (0, express_1.Router)();
/**
 * GET /reports/:projectId
 * GET /reports/:projectId?month=2026-03
 *
 * Roles: admin, manager, client (read-only)
 */
router.get("/:projectId", auth_middleware_1.authMiddleware, (0, role_middleware_1.allowRoles)(["admin", "manager", "client"]), (0, validate_1.validateUuidParam)("projectId"), reports_controller_1.getReport);
exports.default = router;
