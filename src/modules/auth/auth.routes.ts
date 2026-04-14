import { Router } from "express";
import * as controller from "./auth.controller";

const router = Router();

// ✅ LOGIN ONLY (since register does not exist)
router.post("/login", controller.login);

export default router;
