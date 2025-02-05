import { Router } from "express";
import { getPing, pingExternalSevices } from "../controllers/ping";
import { authorize } from "../controllers/auth";
import { addTableIfDoesntExists, generateModelFromTable, retrieveTableModel } from "../controllers/table";
import { getAll, post, get, remove, put, destroy } from "../controllers/cruds";
import { dynamicValidator } from "../controllers/validators";
import { configRequest, unsupportedUrl } from "micro-nodes-shared";

const router = Router();

router.all('*', configRequest);

router.get('/ping/ext', pingExternalSevices);
router.get('/ping', getPing);

router.post("/:tableName", addTableIfDoesntExists, authorize, dynamicValidator, generateModelFromTable, post);

const crudRouter = Router();
crudRouter.delete("/:id",generateModelFromTable, remove);
crudRouter.delete('/', generateModelFromTable, destroy);
crudRouter.put("/:id", dynamicValidator, generateModelFromTable,  put);
crudRouter.get("/:id", generateModelFromTable, get);
crudRouter.get("/", generateModelFromTable, getAll);
router.use("/:tableName", retrieveTableModel, authorize , crudRouter);

router.use('*', unsupportedUrl);

export default router;
