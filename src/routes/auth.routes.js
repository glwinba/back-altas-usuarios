import { Router } from "express";
import { signIn } from "../controllers/auth.controller";
import { createUserLogin } from "../controllers/userlogin.controller";
import { verifyToken } from "../middlewares/authjwt";

const router = Router();

router.post("/createuserlogin", verifyToken, createUserLogin);
router.post("/sigin", signIn);

export default router;
