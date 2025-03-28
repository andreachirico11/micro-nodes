import { Request, RequestHandler } from 'express';
import { existsSync } from 'fs';
import {
  ErrorCodes,
  FILE_EXISTS,
  GENERIC,
  INTERNAL_SERVER,
  log_error, log_info,
  NON_EXISTENT,
  NotFoundResp,
  ServerErrorResp,
  ServerErrorRespWithMessage,
  SuccessResponse,
  UnauthorizedResp,
  UPLOAD_ERROR
} from 'micro-nodes-shared';
import * as multer from 'multer';
import { multerSingle } from '../configs/multer';
import { StaticFileInfo } from '../model/StaticFileInfo';
import { FileIdRequest, StoreRequest } from '../types/Requests';
import deleteFileFs, { deleteFileFsAsync } from '../utils/deleteFileFs';
import { GetSetRequestProps } from '../utils/GetSetAppInRequest';

export const storeFIle: RequestHandler = async (req: Request, res, next) => {
  multerSingle(req, res, function (e) {
    GetSetRequestProps.setStoringError(req, e || null);
    next();
  });
};

export const afterStoreFile: RequestHandler = async (req: StoreRequest, res, next) => {
  const storingError = GetSetRequestProps.getStoringError(req);
  if (!storingError) {
    log_info('File successfully stored');
    return next();
  }
  let errCode: ErrorCodes = INTERNAL_SERVER;
  if (storingError instanceof multer.MulterError) {
    log_error(storingError.message, 'MULTER ERROR -> ' + storingError.code);
    errCode = UPLOAD_ERROR;
  } else if (storingError.message === FILE_EXISTS) {
    log_error('THE FILE ALREADY EXISTS');
    errCode = FILE_EXISTS;
  } else {
    log_error(storingError.message, 'NON MULTER ERROR');
  }
  new ServerErrorResp(res, errCode);
};

export const saveFileInfo: RequestHandler = async (req: StoreRequest, res, next) => {
  const { filePath, folderPath, type, fileName } = GetSetRequestProps.getFileInfo(req);
  const { "app-api-key": app_api_key } = req.headers;
  try {
    const { _id } = await StaticFileInfo.create({
      fileName,
      filePath,
      type,
      ...(folderPath && { folderPath }),
      ...(app_api_key && { app_api_key }),
    });
    return new SuccessResponse(res, { fileCreated: _id });
  } catch (error) {
    log_error(error, 'ERROR SAVING FILE STATS');
    deleteFileFs(filePath, folderPath);
    return new ServerErrorRespWithMessage(res, 'File Not Saved');
  }
};

export const getFile: RequestHandler = async (req: FileIdRequest, res, next) => {
  const { fileId } = req.params,
    { "app-api-key": apiKey } = req.headers;
  log_info('Getting file with id: ' + fileId);
  const foundFileInfo = await StaticFileInfo.findByPk(fileId);
  if (!foundFileInfo) {
    log_error('File Not Found');
    return new NotFoundResp(res, NON_EXISTENT);
  }
  log_info(foundFileInfo.dataValues, 'FILE INFO');
  if (!!foundFileInfo.app_api_key && apiKey !== foundFileInfo.app_api_key) {
    log_error('DIfferent api key');
    return new UnauthorizedResp(res);
  }
  if (!existsSync(foundFileInfo.filePath)) {
    log_error("FILE DOESN'T EXISTS");
    return new NotFoundResp(res, NON_EXISTENT);
  }
  res.sendFile(foundFileInfo.filePath, (sendFileError: Error) => {
    if (!!!sendFileError) {
      log_info('FILE SENT');
    } else if (sendFileError['status'] === 404) {
      log_error(sendFileError, "FILE DOESN'T EXISTS");
      new NotFoundResp(res, NON_EXISTENT);
    } else {
      log_error(sendFileError, 'ERROR SENDING FILE');
      new ServerErrorResp(res, INTERNAL_SERVER);
    }
  });
};

export const deleteFile: RequestHandler = async (req: FileIdRequest, res, next) => {
  const { fileId } = req.params;
  log_info('Start deleting process for file with id: ' + fileId);
  const foundFileInfo = await StaticFileInfo.findByPk(fileId);
  if (!foundFileInfo || !existsSync(foundFileInfo.filePath)) {
    log_error('File Not Found');
    return new NotFoundResp(res, NON_EXISTENT);
  }
  try {
    const { filePath, folderPath } = foundFileInfo;
    await foundFileInfo.destroy();
    log_info('FILE INFO DELETED');
    if (!(await deleteFileFsAsync(filePath, folderPath))) throw new Error();
    log_info('FILE DELETED FROM SYSTEM');
    return new SuccessResponse(res);
  } catch (error) {
    log_error(error, 'Error deleting file id: ' + fileId);
    return new ServerErrorResp(res, GENERIC);
  }
};
