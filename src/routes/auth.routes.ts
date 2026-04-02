console.log("🔥 AUTH ROUTES LOADED");
import { Router } from "express";
import * as controller from "../controllers/auth.controllers";

const router = Router();

router.post("/register", controller.register);
router.post("/login", controller.login);

export default router;   // 🔥 THIS LINE MUST EXIST
