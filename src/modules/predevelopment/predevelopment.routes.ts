import { Router } from "express";

import * as controller from "./predevelopment.controller";

import { authMiddleware } from "../../middleware/auth.middleware";

import { allowRoles } from "../../middleware/role.middleware";
import { validateUuidParam } from "../../middleware/validate";

const router = Router();



// =============================
// CATEGORY ROUTES
// =============================

router.post(
  "/categories",
  authMiddleware,
  allowRoles(["admin", "manager"]),
  controller.addCategory
);

router.get(
  "/categories/project/:projectId",
  authMiddleware,
  allowRoles([
    "admin",
    "manager",
    "client",
  ]),
  validateUuidParam("projectId"),
  controller.getCategoriesByProject
);

router.put(
  "/categories/:id",
  authMiddleware,
  allowRoles(["admin", "manager"]),
  controller.updateCategory
);

router.delete(
  "/categories/:id",
  authMiddleware,
  allowRoles(["admin"]),
  controller.deleteCategory
);



// =============================
// COST ITEM ROUTES
// =============================

router.post(
  "/items",
  authMiddleware,
  allowRoles(["admin", "manager"]),
  controller.addCostItem
);

router.get(
  "/items/category/:categoryId",
  authMiddleware,
  allowRoles([
    "admin",
    "manager",
    "client",
  ]),
  controller.getItemsByCategory
);

router.put(
  "/items/:id",
  authMiddleware,
  allowRoles(["admin", "manager"]),
  controller.updateCostItem
);

router.delete(
  "/items/:id",
  authMiddleware,
  allowRoles(["admin"]),
  controller.deleteCostItem
);



// =============================
// ATTACHMENT ROUTES
// =============================

router.post(
  "/attachments",
  authMiddleware,
  allowRoles(["admin", "manager"]),
  controller.addAttachment
);

router.get(
  "/attachments/:costItemId",
  authMiddleware,
  allowRoles([
    "admin",
    "manager",
    "client",
  ]),
  controller.getAttachments
);

router.delete(
  "/attachments/:id",
  authMiddleware,
  allowRoles(["admin"]),
  controller.deleteAttachment
);

export default router;