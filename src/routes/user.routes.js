import { Router } from "express";
import { changePassword, createUserProveedor, getUser, getUserEmpresas, getUsers, updateEmail, updateRFCInternal } from "../controllers/user.controller.js";
import { addEmpresUser, createUserProveedorMasive, readExcel } from "../controllers/userscreate.controller.js";

const router = Router();

router.put('/changePassword/:id', changePassword);
router.put('/updateRFCInternal/:id', updateRFCInternal);
router.post('/createuser', createUserProveedor);
router.post('/createusermasive', createUserProveedorMasive);
router.get('/getUsers', getUsers);
router.put('/updateEmail/:id', updateEmail);
router.get('/getUser/:id', getUser);
router.post('/readExcel', readExcel);
router.get('/getuserempresa/:id', getUserEmpresas);
router.post('/addEmpresUser', addEmpresUser);





export default router