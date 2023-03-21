import { Router } from "express";
import { createSupposed, findUltimateContentDocs, getAllCatalogueList69SAT, historyBlackLists69SAT } from "../../controllers/ListasNegras/list69sat.controller";

const router = Router();

router.get('/getcataloguelist69SAT', getAllCatalogueList69SAT);
router.post('/createSupposed', createSupposed);
router.get('/historyBlackLists69SAT', historyBlackLists69SAT);
router.get('/findUltimateContentDocs', findUltimateContentDocs);

export default router