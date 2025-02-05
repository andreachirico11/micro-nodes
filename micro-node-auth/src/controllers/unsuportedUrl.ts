import { RequestHandler } from 'express';
import { log_warn } from 'micro-nodes-shared';
import { NotFoundResp } from '../types/ApiResponses';
import { UNSUPPORTED_URL } from '../types/ErrorCodes';

export const unsupportedUrl: RequestHandler = (req, res) => {
  log_warn('Unsupported Url');
  new NotFoundResp(res, UNSUPPORTED_URL);
};
