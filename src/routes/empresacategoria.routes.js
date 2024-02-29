import { Router } from "express";
import { createEmpresaCategoria } from "../controllers/empresacategoria.controller";

const router = Router();

router.post('/createempresacategoria', createEmpresaCategoria)
export default router