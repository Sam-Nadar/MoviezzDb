import express from "express";
import { login, register,adminLogin } from "../controllers/auth.controller";

const router = express.Router();
router.post("/register", register);
router.post("/login", login );
//  Admin login (only for admins)
router.post("/admin-login", adminLogin);

export default router;
