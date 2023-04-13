import { Router } from "express";
import { allEmpresas, allEmpresaSelect, createCompanyComplete, getCategoryMateriality, listTypeCompanies } from "../controllers/empresa.controller";

const router = Router();

router.get('/empresasallselect', allEmpresaSelect);
router.get('/getEmpresas', allEmpresas);
router.get('/getCategoryMateriality', getCategoryMateriality);
router.get('/listTypeCompanies', listTypeCompanies);
router.post('/createcompany', createCompanyComplete);

export default router