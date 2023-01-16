import { Router } from "express";
import { changePassword } from "../controllers/user.controller.js";

const router = Router();

router.put('/changePassword', changePassword);

// router.get('/users', getUser);




export default router