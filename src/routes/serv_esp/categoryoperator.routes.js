import { Router } from "express";
import { FindCategoryOperatorById } from "../../controllers/serv_esp/operatorcategory.controller";
import { CreateCategoryAndDocuments } from "../../controllers/serv_esp/customer/operatorcategory.controller";

const router = Router();

router.get('/FindCategoryOperatorById/:id', FindCategoryOperatorById)

router.post('/customer/createcategoryanddocuments/:idOperador', CreateCategoryAndDocuments)
export default router