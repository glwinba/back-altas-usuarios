import { Router } from "express";
import { login } from "../controllers/auth.controller";
import { createUserLogin } from "../controllers/userlogin.controller";

const router = Router();

router.post("/createuserlogin", createUserLogin);
router.post("/login", login);


export default router;
