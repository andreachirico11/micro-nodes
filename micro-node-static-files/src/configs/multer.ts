import { existsSync, mkdirSync } from 'fs';
import * as multer from 'multer';
import { FILE_MAX_SIZE, MULTIPART_FILE_PROP_NAME, STORAGE_PATH } from '../configs/Envs';
import { StoreRequest } from '../types/Requests';
import { log_info } from 'micro-nodes-shared';
import { ALREADY_EXISTENT } from '../types/ErrorCodes';
import { MulterOptCallback, MulterFIlterCallback } from '../types/multer';
import { getFilePath, getFilePathWithTItle } from '../utils/path-utils';
import { GetSetRequestProps } from '../utils/GetSetAppInRequest';

const destination = (req: StoreRequest, file: Express.Multer.File, callback: MulterOptCallback) => {
  const destinationPath = getFilePath(STORAGE_PATH, req.body.subPath);
  if (req.body.subPath) {
    GetSetRequestProps.setFileInfo(req, { ...GetSetRequestProps.getFileInfo(req), folderPath: destinationPath });
  }
  if (!existsSync(destinationPath)) {
    log_info('CREATING FILE DESTINATION PATH');
     mkdirSync(destinationPath, { recursive: true });
  }
  log_info(destinationPath, 'FILE DESTINATION PATH');
  callback(null, destinationPath);
};

const filename = (
  req: StoreRequest,
  { originalname }: Express.Multer.File,
  callback: MulterOptCallback
) => {
  log_info(originalname, 'FILE NAME');
  callback(null, originalname);
};

const fileFilter = (
  req: StoreRequest,
  { originalname, mimetype }: Express.Multer.File,
  callback: MulterFIlterCallback
) => {
  const filePath = getFilePathWithTItle(originalname, STORAGE_PATH, req.body.subPath);
  GetSetRequestProps.setFileInfo(req, { fileName: originalname, type: mimetype, filePath });
  if (existsSync(filePath)) callback(new Error(ALREADY_EXISTENT), false);
  else callback(null, true);
};

const multerOptions: multer.Options = {
  storage: multer.diskStorage({
    destination,
    filename,
  }),
  fileFilter,
  limits: { fileSize: FILE_MAX_SIZE },
};

export const multerSingle = multer(multerOptions).single(MULTIPART_FILE_PROP_NAME);
