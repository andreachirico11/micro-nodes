import { Response } from 'express';
import { BAD_DECRYPT, ErrorCodes, VALIDATION } from './ErrorCodes';

const sender = (res: Response, status, json: any) => res.status(status).json(json);

export class SuccessResponse {
  constructor(res: Response, payload?: any) {
    if (!!payload && typeof payload === 'string') {
        payload = {message: payload};
    }
    sender(res, 200, {success: true, ...payload && {payload}});
  }
}

abstract class ErrorResponse {
    constructor(res: Response, status: number, errCode: ErrorCodes, errors: string[] = null) {
        sender(res, status, {success: false, errCode, ...errors && {errors}});
    }
}

export class ServerErrorResp extends ErrorResponse {
    constructor(res: Response, errCode: ErrorCodes) {
        super(res, 500, errCode);
    }
}

export class NotFoundResp extends ErrorResponse {
    constructor(res: Response, errCode: ErrorCodes) {
        super(res, 404, errCode);
    }
}

export class ValidationErrResp extends ErrorResponse {
    constructor(res: Response, errors: string[] = null) {
        super(res, 422, VALIDATION, errors);
    }
}

export class BadDecrypt extends ErrorResponse {
    constructor(res: Response, errors: string[] = null) {
        super(res, 422, BAD_DECRYPT, errors);
    }
}