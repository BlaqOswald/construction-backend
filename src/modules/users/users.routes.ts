import { Router } from "express";
import * as controller from "./users.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { allowRoles } from "../../middleware/role.middleware";

const router = Router();

/**
 * ADMIN ONLY - create users
 */
router.post(
  "/",
  authMiddleware,
  allowRoles(["admin"]),
  controller.createUser
);

/**
 * ADMIN ONLY - get users
 */
router.get(
  "/",
  authMiddleware,
  allowRoles(["admin"]),
  controller.getUsers
);

/**
 * FIRST TIME PASSWORD SETUP (PUBLIC)
 */
router.post("/set-password", controller.setPassword);

export default router;