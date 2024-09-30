import express from "express";
import * as UserControl from "../controller/users";
import { requireAuth } from "../middleware/auth";

const router = express.Router();
router.post("/signup", UserControl.signUp);
router.post("/login", UserControl.Login);
router.get("/", requireAuth, UserControl.getAuth);
router.post("/logout", UserControl.logout);

export default router;
