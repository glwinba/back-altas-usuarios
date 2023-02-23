import { Router } from "express";
import { allEmpresas, allEmpresaSelect } from "../controllers/empresa.controller";

const router = Router();

router.get('/empresasallselect', allEmpresaSelect);
router.get('/getEmpresas', allEmpresas);



export default router