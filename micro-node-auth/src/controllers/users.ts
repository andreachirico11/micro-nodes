import { RequestHandler } from 'express';
import { log_error, log_info, RequestWithCustomHeader } from 'micro-nodes-shared';
import { NotFoundResp, ServerErrorResp, HeaderApiKey, SuccessResponse } from 'micro-nodes-shared';
import { INTERNAL_SERVER, NON_EXISTENT, UNAUTHORIZED, NodeTlsHandler } from 'micro-nodes-shared';
import { UserModel } from '../models/User';
import {
  AddUserReq, AuthRequest,
  DeleteAppReq,
  RequestWithUserIdInParams
} from '../models/RequestTypes';
import { GetSetRequestProps } from '../utils/GetSetAppInRequest';
import callMicroHash from '../utils/callMicroHash';

export const getAllUsers: RequestHandler = async (
  req: RequestWithCustomHeader<any, any, any, HeaderApiKey>,
  res
) => {
  try {
    log_info('Retrieving all users' );
    const users = await UserModel.findAll();
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
    const {_id: app_id} = GetSetRequestProps.getApp(req);
    if (foundUser.app_id !== app_id) {
      log_error("User doesn't exists for this app");
      return new NotFoundResp(res, UNAUTHORIZED)
    }
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
    log_info(`Returning ${user.name}`);
    return new SuccessResponse(res, user);
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
    const { dataValues: userCreated } = await UserModel.create({
      ...otherProps,
      app_id,
      password: hashedPsw,
      dateAdd: new Date(),
      datePasswordChange: new Date(),
    });
    log_info('User created with id: ' + userCreated._id);

    return new SuccessResponse(res, userCreated);
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
    const {dataValues: userUpdated} =  await userToBeUpdated.save();
    log_info('User  with id <<' + userUpdated._id + '>> updated');
    return new SuccessResponse(res, userUpdated);
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