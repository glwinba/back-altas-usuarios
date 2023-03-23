import { Router } from "express";
import { FindCategoryOperatorById } from "../../controllers/serv_esp/operatorcategory.controller";

const router = Router();

router.get('/FindCategoryOperatorById/:id', FindCategoryOperatorById)

export default router