import { Router } from "express";
import authenticateUser from "../middleware/auth.middleware.js";
import { getCurrentUser } from "../controllers/user.controller.js";

const router = Router();

router.get("/me", authenticateUser, getCurrentUser);

export default router;
