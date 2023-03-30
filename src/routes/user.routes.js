import { Router } from "express";
import { findPeriodos2023 } from "../controllers/prueba.controller.js";
import { CreateUserAdmin } from "../controllers/serv_esp/admin/useradmincreate.controller.js";
import { CreateUserCustomer } from "../controllers/serv_esp/customer/usercustomercreate.controller.js";
import { CreateOperatoByUserProveedor } from "../controllers/serv_esp/operator.controller.js";
import { getUser, getUserEmpresas, getUsers, updateEmail, updateRFCInternal, updatePassword } from "../controllers/user.controller.js";
import { CreateUserProveedor } from "../controllers/userscreate.controller.js";
import { extractDataExcel } from "../helpers/excel.js";

const router = Router();

router.put('/updatePassword/:id', updatePassword);
router.put('/updateRFCInternal/:id', updateRFCInternal);

router.post('/createuser', CreateUserProveedor);
router.post('/createusercustomer', CreateUserCustomer);
router.post('/createuseradmin', CreateUserAdmin);

router.post('/extractdataexcel', extractDataExcel);

router.post('/createoperatobyuserproveedor', CreateOperatoByUserProveedor);

router.get('/getUsers', getUsers);
router.put('/updateEmail/:id', updateEmail);
router.get('/getUser/:id', getUser);
router.get('/getuserempresa/:id', getUserEmpresas);
router.get('/findPeriodos2023', findPeriodos2023);




export default router