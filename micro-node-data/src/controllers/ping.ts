import { RequestHandler } from 'express';
import { log_error, log_info, NO_RESPONSE, SeviceUnavailable, NodeTlsHandler } from 'micro-nodes-shared';
import { ServerErrorResp, SuccessResponse } from 'micro-nodes-shared';
import { GENERIC } from 'micro-nodes-shared';
import { GetSetRequestProps } from '../utils/GetSetAppInRequest';
import { getDbState } from '../configs/mongoose';
import { AuthHelper } from '../configs/MicroHelper';

export const getPing: RequestHandler = async (req, res) => {
  try {

    log_info('Start ping');
    const message = "Ping from db = " + getDbState().toUpperCase()
    log_info(message);
    return new SuccessResponse(res, {message, host: GetSetRequestProps.getClientIp(req)});
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