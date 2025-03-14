import { RequestHandler } from 'express';
import { GENERIC, log_error, log_info, NO_RESPONSE, ServerErrorResp, SeviceUnavailable, SuccessResponse, NodeTlsHandler } from 'micro-nodes-shared';
import { AuthHelper } from '../configs/MicroHelper';
import { PingTest } from '../model/PingTest';
import { GetSetRequestProps } from '../utils/GetSetAppInRequest';

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
