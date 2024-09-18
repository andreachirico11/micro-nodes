import { RequestHandler } from 'express';
import { log_error, log_info } from '../utils/log';
import {
  NotFoundResp,
  ServerErrorResp,
  SuccessResponse
} from '../types/ApiResponses';
import { INTERNAL_SERVER, NON_EXISTENT } from '../types/ErrorCodes';
import { UserModel } from '../models/User';
import {
  AddUserReq, AuthRequest,
  DeleteAppReq,
  HeaderApiKey,
  RequestWithCustomHeader,
  RequestWithUserIdInParams
} from '../models/RequestTypes';
import { GetSetRequestProps } from '../utils/GetSetAppInRequest';
import { NodeTlsHandler } from '../configs/Envs';
import callMicroHash from '../utils/callMicroHash';

export const getAllUsers: RequestHandler = async (
  req: RequestWithCustomHeader<any, any, any, HeaderApiKey>,
  res
) => {
  try {
    const { _id: app_id } = GetSetRequestProps.getApp(req);
    log_info('Retrieving all users for app with id: ' + app_id);
    const users = await UserModel.findAll({ where: { app_id } });
    log_info('Number of users found: ' + users.length);
    return new SuccessResponse(res, { users });
  } catch (e) {
    log_error(e, 'Error creating new user');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};

export const getUserByNameAndAppAndContinue: RequestHandler = async (
  req: AuthRequest,
  res,
  next
) => {
  try {
    const {
      body: { username },
    } = req;
    log_info(`Getting User ` + username);
    const { _id } = GetSetRequestProps.getApp(req);
    const foundUser = await UserModel.findOne({ where: { name: username, app_id: _id } });
    log_info('Success');

    if (!!!foundUser) {
      log_error("User doesn't exists");
      return new NotFoundResp(res, NON_EXISTENT);
    }

    GetSetRequestProps.setUser(req, foundUser);
    next();
  } catch (e) {
    log_error(e, 'Error Getting User');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};

export const getUserByIdAndContinue: RequestHandler = async (
  req: RequestWithUserIdInParams,
  res,
  next
) => {
  try {
    const {
      params: { userId },
    } = req;
    log_info(`Getting User with id: ` + userId);
    const foundUser = await UserModel.findByPk(userId);
    if (!!!foundUser) {
      log_error("User doesn't exists");
      return new NotFoundResp(res, NON_EXISTENT);
    }
    log_info('User Found');
    GetSetRequestProps.setUser(req, foundUser);
    next();
  } catch (e) {
    log_error(e, 'Error Getting User');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};

export const returnUser: RequestHandler = async (req: AuthRequest, res) => {
  try {
    const user = GetSetRequestProps.getUser(req);
    log_info(`Returning ${user.name} tokens`);
    return new SuccessResponse(res, { user });
  } catch (e) {
    log_error(e, 'Error Getting User');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};

export const addUser: RequestHandler = async (req: AddUserReq, res) => {
  try {
    const { password, ...otherProps } = req.body;
    const { _id: app_id } = GetSetRequestProps.getApp(req);

    NodeTlsHandler.disableTls();
    log_info('Call micro-node-crypt hashing service');
    const hashedPsw = await callMicroHash(password);
    log_info('Password hashed successfully');

    log_info(otherProps, 'Creating new user with data: ');
    const { _id: user_id } = await UserModel.create({
      ...otherProps,
      app_id,
      password: hashedPsw,
      dateAdd: new Date(),
      datePasswordChange: new Date(),
    });
    log_info('User created with id: ' + user_id);

    return new SuccessResponse(res);
  } catch (e) {
    log_error(e, 'Error creating new user');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  } finally {
    NodeTlsHandler.enableTls();
  }
};

export const updateUser: RequestHandler = async (req: AddUserReq, res) => {
  try {
    const { name } = req.body;
    const userToBeUpdated = GetSetRequestProps.getUser(req);
    if (!!name) userToBeUpdated.name = name;
    await userToBeUpdated.save();
    log_info('User  with id <<' + userToBeUpdated._id + '>> updated');
    return new SuccessResponse(res);
  } catch (e) {
    log_error(e, 'Error creating new user');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  } finally {
    NodeTlsHandler.enableTls();
  }
};

export const deleteUser: RequestHandler = async (req: AddUserReq, res) => {
  try {
    const userToDelete = GetSetRequestProps.getUser(req);
    log_info('Deleting user with id: ' + userToDelete._id);
    await userToDelete.destroy();
    log_info('Deleted');
    return new SuccessResponse(res);
  } catch (e) {
    log_error(e, 'Error creating new user');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};

export const cascadeDeleteUsers: RequestHandler = async (req: DeleteAppReq, res, next) => {
  try {
    const {
      params: { appId: app_id },
    } = req;
    log_info('Deleting all user for the app with id: ' + app_id);
    const numOfDeleted = await UserModel.destroy({ where: { app_id } });
    log_info('Deleted ' + numOfDeleted + ' users');
    next();
  } catch (e) {
    log_error(e, 'Error updating user with new tokens');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};