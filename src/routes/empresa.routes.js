import { Router } from "express";
import { allEmpresas, allEmpresaSelect, createCompanyComplete } from "../controllers/empresa.controller";

const router = Router();

router.get('/empresasallselect', allEmpresaSelect);
router.get('/getEmpresas', allEmpresas);
router.post('/createcompany', createCompanyComplete);


export default router