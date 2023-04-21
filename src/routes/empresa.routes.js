import { Router } from "express";
import { allEmpresas, allEmpresaSelect, createCompanyBaja, createCompanyComplete, createCompanyCompleteMasive, generateExcel, getCategoryMateriality, listTypeCompanies } from "../controllers/empresa.controller";

const router = Router();

router.get('/empresasallselect', allEmpresaSelect);
router.get('/getEmpresas', allEmpresas);
router.get('/getCategoryMateriality', getCategoryMateriality);
router.get('/listTypeCompanies', listTypeCompanies);
router.post('/createcompany', createCompanyComplete);
router.post('/createcompanycompletemasive', createCompanyCompleteMasive);
router.get('/generateExcel', generateExcel);
router.post('/createcompanybaja', createCompanyBaja)
export default router