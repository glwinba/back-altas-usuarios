import { Router } from "express";
import { createGrupos, getGrupos } from "../controllers/grupos.controller";

const router = Router();

router.get("/getGrupos", getGrupos);
router.post("/createGrupos", createGrupos);

export default router