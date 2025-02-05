import { RequestHandler, Request } from "express";
import { getClientIp } from "request-ip";
import { GetSetRequestProps } from "../utils/GetSetAppInRequest";
import { log_info } from "micro-nodes-shared";

export const configRequest: RequestHandler = async (req: Request, _, next) => {
  const ipAddress = getClientIp(req);
  log_info(ipAddress, 'GOT REQUEST FROM: ');
  GetSetRequestProps.setClientIp(req, ipAddress);
  next();
};
