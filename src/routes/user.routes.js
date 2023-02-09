import { Router } from "express";
import { changePassword, createUserProveedor, updateRFCInternal } from "../controllers/user.controller.js";

const router = Router();

router.put('/changePassword/:id', changePassword);
router.put('/updateRFCInternal/:id', updateRFCInternal);
router.post('/createuser', createUserProveedor);


export default router