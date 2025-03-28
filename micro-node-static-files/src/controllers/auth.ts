import { RequestHandler } from 'express';
import { INTERNAL_SERVER, isAuthErrorResponse, log_error, log_info, ServerErrorResp, UnauthorizedResp, NodeTlsHandler } from 'micro-nodes-shared';
import { BYPASS_AUTH } from '../configs/Envs';
import { AuthHelper } from '../configs/MicroHelper';
import { AllProtectedRequests } from '../types/Requests';

export const authorize: RequestHandler = async (req: AllProtectedRequests, res, next) => {
  if (BYPASS_AUTH) {
    log_info('BYPASSING AUTHENTICATION');
    return next();
  }
  try {
    const {
      headers: { "app-api-key": apiKey, authorization },
    } = req;

    if (!!!apiKey) {
      log_error('Missing Api key');
      return new UnauthorizedResp(res, 'Missing Api key');
    }

    if (!!!authorization) {
      log_error('Impossible to verify authorization');
      return new UnauthorizedResp(res, 'Missing Api key or token');
    }
    log_info(
      `Check if the token << ${authorization} >> is valid for the api key << ${apiKey} >>`,
      `The route is protected`
    );
    NodeTlsHandler.disableTls();

    const response = await AuthHelper.checkToken(apiKey, authorization);

    if (isAuthErrorResponse(response)) {
      log_error(response.errors, response.errCode);
      return new UnauthorizedResp(res, 'invalid token');
    }
    log_info('Token Valid');
    return next();
  } catch (e) {
    log_error(e, 'Error checking the authentication');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  } finally {
    NodeTlsHandler.enableTls();
  }
};
