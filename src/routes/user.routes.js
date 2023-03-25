import { Router } from "express";
import { findPeriodos2023 } from "../controllers/prueba.controller.js";
import { CreateUserAdmin } from "../controllers/serv_esp/admin/useradmincreate.controller.js";
import { CreateUserCustomer } from "../controllers/serv_esp/customer/usercustomercreate.controller.js";
import { getUser, getUserEmpresas, getUsers, updateEmail, updateRFCInternal, updatePassword } from "../controllers/user.controller.js";
import { addEmpresUser, CreateUserProveedor, readExcel } from "../controllers/userscreate.controller.js";

const router = Router();

router.put('/updatePassword/:id', updatePassword);
router.put('/updateRFCInternal/:id', updateRFCInternal);

router.post('/createuser', CreateUserProveedor);
router.post('/createusercustomer', CreateUserCustomer);

router.get('/getUsers', getUsers);
router.put('/updateEmail/:id', updateEmail);
router.get('/getUser/:id', getUser);
router.post('/readExcel', readExcel);
router.get('/getuserempresa/:id', getUserEmpresas);
router.post('/addEmpresUser', addEmpresUser);
router.post('/createuseradmin', CreateUserAdmin);
router.get('/findPeriodos2023', findPeriodos2023);




export default router