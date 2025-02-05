import { RequestHandler } from 'express';
import { log_info } from 'micro-nodes-shared';
import { getClientIp } from 'request-ip';
import { GetSetRequestProps } from '../utils/GetSetAppInRequest';
import { Request } from 'express';
import { TableNameParams } from '../types/Requests';


export const configRequest: RequestHandler = async (req: Request<TableNameParams>, _, next) => {
  const ipAddress = getClientIp(req);
  log_info(ipAddress, "GOT REQUEST FROM: ");
  GetSetRequestProps.setClientIp(req, ipAddress);
  next();
};