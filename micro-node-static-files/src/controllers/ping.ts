import { RequestHandler } from 'express';
import { log_error, log_info } from '../utils/log';
import { ServerErrorResp, SeviceUnavailable, SuccessResponse } from '../types/ApiResponses';
import { GENERIC, NO_RESPONSE } from '../types/ErrorCodes';
import { GetSetRequestProps } from '../utils/GetSetAppInRequest';
import { NodeTlsHandler } from '../configs/Envs';
import { PingTest } from '../model/PingTest';
import { AuthHelper } from '../configs/MicroHelper';

export const getPing: RequestHandler = async (req, res) => {
  try {
    const host = GetSetRequestProps.getClientIp(req),
      message = 'Ping test micro static';
    log_info('Ping Test from ' + host);
    return new SuccessResponse(res, { message, host });
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
    log_info('Start Ping Test From Micro Node Auth');
    NodeTlsHandler.disableTls();
    if (await AuthHelper.ping()) {
      const logPhrase = 'Micro Auth Connected';
      log_info(logPhrase, 'Success!!!');
      return new SuccessResponse(res, logPhrase);
    }
    log_error('No response');
    throw new Error();
  } catch (e) {
    log_error(e, 'Error Calling Micro Auth');
    return new SeviceUnavailable(res, NO_RESPONSE);
  } finally {
    NodeTlsHandler.enableTls();
  }
};
