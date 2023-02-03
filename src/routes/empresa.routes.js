import { Router } from "express";
import { allEmpresaSelect } from "../controllers/empresa.controller";

const router = Router();

router.get('/empresasallselect', allEmpresaSelect);


export default router