import { Router } from "express";
import * as controller from "./users.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { allowRoles } from "../../middleware/role.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  allowRoles(["admin"]),
  controller.createUser
);

router.get(
  "/",
  authMiddleware,
  allowRoles(["admin"]),
  controller.getUsers
);

router.post("/login", controller.login);
router.post("/set-password", controller.setPassword);

export default router;