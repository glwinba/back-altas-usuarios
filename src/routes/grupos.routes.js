import { Router } from "express";
import { getGrupos } from "../controllers/grupos.controller";

const router = Router();

router.get("/getGrupos", getGrupos);

export default router