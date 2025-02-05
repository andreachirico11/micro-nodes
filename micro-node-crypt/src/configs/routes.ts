import { getPing } from '../controllers/ping';
import { Router } from 'express';
import { crypt, decrypt } from '../controllers/crypt';
import { getRequestBodyValidator } from '../controllers/validators';
import { cryptValidator } from '../validators/crypt';
import { compareValidator, hashValidator } from '../validators/hash';
import { compare, hash } from '../controllers/hash';
import { getApiKey } from '../controllers/apiKey';
import { configRequest, unsupportedUrl } from 'micro-nodes-shared';

const router = Router();
router.all("*", configRequest)
router.post('/crypt', getRequestBodyValidator(cryptValidator), crypt);
router.post('/decrypt', getRequestBodyValidator(cryptValidator), decrypt);
router.post('/hash', getRequestBodyValidator(hashValidator), hash);
router.post('/hashCompare', getRequestBodyValidator(compareValidator), compare);
router.get('/key', getApiKey);
router.get('/ping', getPing);
router.use('*', unsupportedUrl);

export default router;
