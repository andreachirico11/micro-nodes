import { RequestHandler } from 'express';
import { AllProtectedRequests } from '../types/Requests';
import { log_error, log_info } from 'micro-nodes-shared';
import { ServerErrorResp, UnauthorizedResp } from 'micro-nodes-shared';
import { INTERNAL_SERVER } from 'micro-nodes-shared';
import { AuthHelper } from '../configs/MicroHelper';
import { isAuthErrorResponse, NodeTlsHandler } from 'micro-nodes-shared';
import { BYPASS_AUTH } from '../configs/Envs';
import { GetSetRequestProps } from '../utils/GetSetAppInRequest';
import { CrudOperations } from '../types/CrudOperations';
import tableRemover from '../utils/tableRemover';

const isRequestFreeFromCheck = (unCheckedOperations: CrudOperations[], req: AllProtectedRequests) => {
    return unCheckedOperations.some(method => method === req.method)
}

export const authorize: RequestHandler = async (
  req: AllProtectedRequests,
  res,
  next
) => {
  if (BYPASS_AUTH) {
    log_info('BYPASSING AUTHENTICATION');
    return next();
  }
  try {
    const { headers: { "app-api-key": apiKey, authorization } } = req;

    if (!!!apiKey) {
      log_error('Missing Api key');
      return new UnauthorizedResp(res, 'Missing Api key');
    }

    const {unCheckedOperations} = GetSetRequestProps.getTableModel(req);
    log_info(JSON.stringify(unCheckedOperations) , "This collection doesn't need authentication for these operations")
    
    if (isRequestFreeFromCheck(unCheckedOperations, req)) {
      log_info("This request doesn't need to be authorized")
      return next();
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
      tableRemover.eliminateTableIfScheduled();
      log_error(response.errors, response.errCode);
      return new UnauthorizedResp(res, "invalid token");
    }

    log_info('Token Valid');
    return next();
  } catch (e) {
    tableRemover.eliminateTableIfScheduled();
    log_error(e, 'Error checking the authentication');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
  finally {
    NodeTlsHandler.enableTls();
  }
};
