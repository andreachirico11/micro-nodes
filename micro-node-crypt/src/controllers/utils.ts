import { RequestHandler } from 'express';
import { log_info } from '../utils/log';
import { getClientIp } from 'request-ip';

export const configRequest: RequestHandler = async (req, _, next) => {
  const ipAddress = getClientIp(req);
  log_info(ipAddress, "GOT REQUEST FROM: ");
  req['CLIENT_IP'] = ipAddress;
  next();
};