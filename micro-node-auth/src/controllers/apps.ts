import { NextFunction, RequestHandler, Response } from 'express';
import { HashHelper } from '../configs/HashHelper';
import { isHashErrorResponse } from 'micro-nodes-shared';
import { AppModel } from '../models/App';
import {
  AddAppReq,
  DeleteAppReq,
  EmptyHeaderBodyRequest,
  OnlyApiKeyQUery,
  RequestWithAppIdInBody,
  RequestWithAppIdInParams,
  UpdateAppReq
} from '../models/RequestTypes';
import {
  NotFoundResp,
  ServerErrorResp,
  SuccessResponse,
  UnauthorizedResp,
  ValidationErrResp,
  NodeTlsHandler,
  HeaderApiKey,
  ReqWithCustHeaderAndQuery,
} from 'micro-nodes-shared';
import { INTERNAL_SERVER, NON_EXISTENT } from 'micro-nodes-shared';
import { GetSetRequestProps } from '../utils/GetSetAppInRequest';
import { log_error, log_info } from 'micro-nodes-shared';

export const getAllApps: RequestHandler = async (req: EmptyHeaderBodyRequest, res, next) => {
  try {
    log_info('Getting all registered apps');
    const apps = await AppModel.findAll();
    log_info('Retrieved apps length: ' + apps.length);
    return new SuccessResponse(res, apps);
  } catch (e) {
    log_error(e, 'Error updating new app');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};

export const getAppById: RequestHandler = async (req: RequestWithAppIdInParams, res, next) => {
  try {
    const {
      params: { appId },
    } = req;
    log_info('Getting  app with id: ' + appId);
    const foundApp = await AppModel.findByPk(appId);
    if (!!!foundApp) {
      log_error('No app found');
      return new NotFoundResp(res, NON_EXISTENT);
    }
    log_info('Retrieved app with id: ' + appId);  
    return new SuccessResponse(res, foundApp);
  } catch (e) {
    log_error(e, 'Error updating new app');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};

export const addApp: RequestHandler = async ({ body }: AddAppReq, res) => {
  try {
    NodeTlsHandler.disableTls();
    log_info(body, 'Creating new app with data: ');
    log_info('Calling external service to get a new api key');
    const keyResponse = await HashHelper.getNewApiKey();
    if (isHashErrorResponse(keyResponse)) {
      throw new Error("Micro Hash Helper can't provide a valid api key");
    }
    const {
      payload: { key: apiKey },
    } = keyResponse;
    log_info('Key Generated: ' + apiKey);
    const {dataValues: insertedApp} = await AppModel.create({ ...body, dateAdd: new Date(), apiKey });
    log_info("api key: " + insertedApp.apiKey, 'Success');
    return new SuccessResponse(res, insertedApp);
  } catch (e) {
    log_error(e, 'Error creating new app');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  } finally {
    NodeTlsHandler.enableTls();
  }
};

export const updateApp: RequestHandler = async (req: UpdateAppReq, res) => {
  try {
    const appToUpdate = GetSetRequestProps.getApp(req);
    log_info('Updating new app with id: ' + appToUpdate._id);
    const {dataValues: updatedApp} = await appToUpdate.update({ ...req.body });
    log_info('App with id: <<' + updatedApp._id +'>> updated');
    return new SuccessResponse(res, updatedApp);
  } catch (e) {
    log_error(e, 'Error updating new app');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};

export const deleteApp: RequestHandler = async (req: DeleteAppReq, res) => {
  try {
    const appToDelete = GetSetRequestProps.getApp(req);
    log_info('Deleting app with id: ' + appToDelete._id);
    await appToDelete.destroy();
    log_info('App destroyed');
    return new SuccessResponse(res);
  } catch (e) {
    log_error(e, 'Error deleting app');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};

export const getAppIfApikeyIsValid: RequestHandler = async (
  req: ReqWithCustHeaderAndQuery<any, any, any, HeaderApiKey, OnlyApiKeyQUery>,
  res,
  next
) => {
  try {
    const {
        headers,
        query: { only_api_key },
      } = req,
      onlyApiKeyFlag = only_api_key === 'true';
    const { "app-api-key": apiKey } = headers;
    log_info(headers);
    if (!!!apiKey) {
      log_error('The key is missing');
      return new UnauthorizedResp(res, 'The key is missing');
    }
    const linkedApp = await AppModel.findOne({ where: { apiKey } });
    if (!!!linkedApp) {
      log_error('No app is associated with this api key');
      return new NotFoundResp(res, NON_EXISTENT);
    }
    log_info('Found app with name << ' + linkedApp.name + ' >>');

    if (linkedApp.canCheckWithApiKeyOnly && onlyApiKeyFlag) {
      log_info(
        'SUCCESS',
        'Check with API key only passed'
      );
      return new SuccessResponse(res);
    }

    GetSetRequestProps.setApp(req, linkedApp);
    next();
  } catch (e) {
    log_error(e, 'Error using api key');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};

export const checkIfAppExistsFromParams: RequestHandler = async (
  req: RequestWithAppIdInParams,
  res,
  next
) => {
  const {
    params: { appId },
  } = req;
  return checkIfAppExist(parseInt(appId), req, res, next);
};

export const checkIfAppExistsFromBody: RequestHandler = async (
  req: RequestWithAppIdInBody,
  res,
  next
) => {
  let {
    body: { appId },
  } = req;
  return checkIfAppExist(appId, req, res, next);
};

const checkIfAppExist = async (
  _id: number | string,
  req: RequestWithAppIdInBody | RequestWithAppIdInParams,
  res: Response,
  next: NextFunction
) => {
  try {
    if (typeof _id === 'string') _id = parseInt(_id);
    if (isNaN(_id)) {
      log_error('The app id is not a valid number');
      return new ValidationErrResp(res);
    }

    log_info(`Check if App with id: ${_id} exists`);
    const existentApp = await AppModel.findOne({ where: { _id } });
    if (!!!existentApp) {
      log_error("App doesn't exists");
      return new NotFoundResp(res, NON_EXISTENT);
    }
    log_info('Success');

    GetSetRequestProps.setApp(req, existentApp);
    next();
  } catch (e) {
    log_error(e, 'Error checking');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};
