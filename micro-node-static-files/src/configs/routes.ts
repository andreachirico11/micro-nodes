import { Router } from "express";
import { afterStoreFile,  deleteFile,  getFile,  saveFileInfo,  storeFIle } from "../controllers/cruds";
import { getPing, getPingDb, pingExternalSevices } from "../controllers/ping";
import { unsupportedUrl } from "../controllers/unsuportedUrl";
import { authorize } from "../controllers/auth";
import { configRequest } from "../controllers/config";

const router = Router();

router.all('*', configRequest);


router.get('/ping/db', getPingDb);
router.get('/ping/ext', pingExternalSevices);
router.get('/ping', getPing);

router.get('/cruds/:fileId', authorize, getFile);
router.delete('/cruds/:fileId', authorize, deleteFile);
router.post('/cruds', authorize, storeFIle, afterStoreFile, saveFileInfo);



router.use('*', unsupportedUrl);

export default router;
