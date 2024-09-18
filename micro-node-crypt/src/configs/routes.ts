import { getPing } from '../controllers/ping';
import { Router } from 'express';
import { unsupportedUrl } from '../controllers/unsuportedUrl';
import { crypt, decrypt } from '../controllers/crypt';
import { getRequestBodyValidator } from '../controllers/validators';
import { cryptValidator } from '../validators/crypt';
import { compareValidator, hashValidator } from '../validators/hash';
import { compare, hash } from '../controllers/hash';
import { configRequest } from '../controllers/utils';
import { getApiKey } from '../controllers/apiKey';

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
