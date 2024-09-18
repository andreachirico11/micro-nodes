import { Router } from "express";
import { afterStoreFile,  getFile,  saveFileInfo,  storeFIle } from "../controllers/cruds";
import { getPing } from "../controllers/ping";
import { unsupportedUrl } from "../controllers/unsuportedUrl";
import { authorize } from "../controllers/auth";
import { configRequest } from "../controllers/config";

const router = Router();

router.all('*', configRequest);

router.get('/ping', getPing);

router.get('/:fileId', authorize, getFile);

router.post('/', authorize, storeFIle, afterStoreFile, saveFileInfo);



router.use('*', unsupportedUrl);

export default router;
