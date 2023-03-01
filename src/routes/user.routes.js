import { Router } from "express";
import { findPeriodos2023 } from "../controllers/prueba.controller.js";
import { changePassword, createUserProveedor, getUser, getUserEmpresas, getUsers, updateEmail, updateRFCInternal } from "../controllers/user.controller.js";
import { addEmpresUser, createUserAdmin, createUserCliente, createUserProveedorMasive, readExcel } from "../controllers/userscreate.controller.js";

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
router.post('/createUserAdmin', createUserAdmin);
router.post('/createUserCliente', createUserCliente);
router.get('/findPeriodos2023', findPeriodos2023);




export default router