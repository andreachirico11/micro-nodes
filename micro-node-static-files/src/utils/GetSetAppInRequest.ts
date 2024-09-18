import { Request } from 'express';
import { IStaticFileInfo } from '../model/StaticFileInfo';

const CLIENT_IP = 'client_ip',
  MULTER_SINGLE_ERROR = 'MULTER_SINGLE_ERROR',
  FILE_INFO = 'FILE_INFO';

export class GetSetRequestProps {
  static getClientIp(req: Request) {
    return req[CLIENT_IP] as string;
  }

  static setClientIp(req: Request, ip: string) {
    req[CLIENT_IP] = ip;
  }
  static getStoringError(req: Request) {
    return req[MULTER_SINGLE_ERROR] as Error;
  }

  static setStoringError(req: Request, e: Error) {
    req[MULTER_SINGLE_ERROR] = e;
  }

  static getFileInfo(req: Request) {
    return req[FILE_INFO] as IStaticFileInfo;
  }

  static setFileInfo(req: Request, i: IStaticFileInfo) {
    req[FILE_INFO] = i;
  }
}
