import { RequestHandler } from 'express';
import { PingTest } from '../models/PingTest';
import { log_error, log_info } from 'micro-nodes-shared';
import { ServerErrorResp, SeviceUnavailable, SuccessResponse } from '../types/ApiResponses';
import { GENERIC, NO_RESPONSE } from '../types/ErrorCodes';
import { HashHelper } from '../configs/HashHelper';
import { GetSetRequestProps } from '../utils/GetSetAppInRequest';
import { NodeTlsHandler } from '../configs/Envs';

export const getPing: RequestHandler = async (req, res) => {
  try {
    const host = GetSetRequestProps.getClientIp(req), message = 'Ping test micro auth';
    log_info('Ping Test from ' + host);
    return new SuccessResponse(res, {message, host});
  } catch (error) {
    log_error(error, 'There was an error fetching tests');
    return new ServerErrorResp(res, GENERIC);
  }
};

export const getPingDb: RequestHandler = async (req, res) => {
  try {
    log_info('Start Ping Test From Db');
    const { name } = await PingTest.findOne({ attributes: ['name'] });
    const message = 'Fetched the test with name: ' + name;
    log_info(message, 'Success!!!');
    return new SuccessResponse(res, { message, host: GetSetRequestProps.getClientIp(req) });
  } catch (error) {
    log_error(error, 'There was an error fetching tests');
    return new ServerErrorResp(res, GENERIC);
  }
};


export const pingExternalSevices: RequestHandler = async (req, res) => {
  try {
    log_info('Start Ping Test From Micro Node Crypt');
    NodeTlsHandler.disableTls();
    if (await HashHelper.ping()) {
      const logPhrase = "Micro Crypt Connected";
      log_info(logPhrase, 'Success!!!');
      return new SuccessResponse(res, logPhrase);
    } 
    log_error('No response');
    throw new Error();
  } catch (e) {
    log_error(e, 'Error Calling Micro Crypt');
    return new SeviceUnavailable(res, NO_RESPONSE);
  } finally {
    NodeTlsHandler.enableTls();
  }
};
