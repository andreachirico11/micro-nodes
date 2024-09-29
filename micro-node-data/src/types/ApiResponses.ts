import { Response } from 'express';
import { ErrorCodes, INTERNAL_SERVER, UNAUTHORIZED, VALIDATION } from './ErrorCodes';

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
    constructor(res: Response, errCode: ErrorCodes = INTERNAL_SERVER, errors: string[] = null) {
        super(res, 500, errCode, errors);
    }
}


export class ServerErrorRespWithMessage extends ServerErrorResp {
    constructor(res: Response, message: string) {
        super(res, INTERNAL_SERVER, [message]);
    }
}

export class SeviceUnavailable extends ErrorResponse {
    constructor(res: Response, errCode: ErrorCodes) {
        super(res, 503, errCode);
    }
}

export class NotFoundResp extends ErrorResponse {
    constructor(res: Response, errCode: ErrorCodes, message: string = null) {
        super(res, 404, errCode, [message]);
    }
}

export class ValidationErrResp extends ErrorResponse {
    constructor(res: Response, errors: string[] = null) {
        super(res, 422, VALIDATION, errors);
    }
}


export class UnauthorizedResp extends ErrorResponse {
    constructor(res: Response, customMessage = "Unauthorized") {
        super(res, 401, UNAUTHORIZED, [customMessage]);
    }
}
