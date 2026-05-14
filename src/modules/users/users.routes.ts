import { Router } from "express";
import * as controller from "./users.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { allowRoles } from "../../middleware/role.middleware";

const router = Router();

/**
 * ADMIN ONLY
 * Create users
 */
router.post(
  "/",
  authMiddleware,
  allowRoles(["admin"]),
  controller.createUser
);

/**
 * ADMIN ONLY
 * View all users
 */
router.get(
  "/",
  authMiddleware,
  allowRoles(["admin"]),
  controller.getUsers
);

/**
 * PUBLIC
 * First-time password setup
 */
router.post(
  "/set-password",
  controller.setPassword
);

export default router;