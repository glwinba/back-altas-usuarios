import { Router } from "express";
import { changePassword } from "../controllers/user.controller.js";

const router = Router();

router.put('/changePassword/:id', changePassword);

export default router