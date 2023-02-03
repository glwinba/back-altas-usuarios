import { Router } from "express";
import { changePassword, createUser, updateRFCInternal } from "../controllers/user.controller.js";

const router = Router();

router.put('/changePassword/:id', changePassword);
router.put('/updateRFCInternal/:id', updateRFCInternal);
router.post('/createuser', createUser);

export default router