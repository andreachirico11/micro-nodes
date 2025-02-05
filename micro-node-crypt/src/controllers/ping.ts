import { RequestHandler } from 'express';
import { SuccessResponse } from 'micro-nodes-shared';
import { log_info } from 'micro-nodes-shared';

export const getPing: RequestHandler = (req, res) => {
  const message = 'Ping Micro Crypt from: ' + req['CLIENT_IP'];
  log_info(message);
  return new SuccessResponse(res, message);
};
