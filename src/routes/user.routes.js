import { Router } from "express";
import { changePassword, updateRFCInternal } from "../controllers/user.controller.js";

const router = Router();

router.put('/changePassword/:id', changePassword);
router.put('/updateRFCInternal/:id', updateRFCInternal);


export default router