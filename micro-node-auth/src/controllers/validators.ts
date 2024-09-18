import { RequestHandler } from 'express';
import { ObjectSchema, ValidationError } from 'yup';
import { log_error, log_info } from '../utils/log';
import { ValidationErrResp } from '../types/ApiResponses';
import { AddUserReq, ChangePasswordRequest, UpdateUserReq } from '../models/RequestTypes';
import { GetSetRequestProps } from '../utils/GetSetAppInRequest';
import generatePasswordSchema from '../utils/validators/Password';

export const getRequestBodyValidator = (schema: ObjectSchema<any>) => {
  return function ({ body }, res, next) {
    try {
      schema.validateSync(body);
      log_info('Request body is valid');
      next();
    } catch (e) {
      let message = 'Unknown Validation Error';
      if (e instanceof ValidationError) {
        message = e.message;
        log_error(message);
      }
      new ValidationErrResp(res, [message]);
    }
  } as RequestHandler;
};

const checkAppPasswordRequirements = async (password: string, req: ChangePasswordRequest | AddUserReq | UpdateUserReq, res, next) => {
  try {
    if (!!!password) {
      log_info("The password does not need to be checked");
      return next();
    }
    const foundApp = GetSetRequestProps.getApp(req);
    const { _id, numbers, passwordLenght, symbols, uppercaseLetters, symbolsRegex } = foundApp;

    log_info(
      { passwordLenght, numbers, symbols, uppercaseLetters },
      `App with id: ${_id} requirements are:`
    );

    generatePasswordSchema(
      passwordLenght,
      numbers,
      symbols,
      uppercaseLetters,
      symbolsRegex
    ).validateSync(password);
    log_info('Password is valid');
    
    next();
  } catch (e) {
    const message =
      e instanceof SyntaxError
        ? 'Invalid Symbol Regular expression'
        : e instanceof ValidationError
        ? e.message
        : 'Unknown Validation Error';
    log_error(message);
    new ValidationErrResp(res, [message]);
  }
}

export const checkAppPasswordRequirementsForPasswordChange: RequestHandler = async (req: ChangePasswordRequest, res, next) => {
  const {
    body: { newPassword },
  } = req;
  return checkAppPasswordRequirements(newPassword, req, res, next);
};

export const checkAppPasswordRequirementsForNewUser: RequestHandler = async (req: AddUserReq | UpdateUserReq, res, next) => {
    const {
      body: { password },
    } = req;
    return checkAppPasswordRequirements(password, req, res, next);
};