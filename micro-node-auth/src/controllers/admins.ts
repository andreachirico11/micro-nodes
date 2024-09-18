import { RequestHandler } from 'express';
import { ADMIN_CRUDS, NodeTlsHandler } from '../configs/Envs';
import {
  AddAdminReq,
  AuthRequest,
  DeleteAdminReq,
  HeaderAdminToken,
  RequestWithCustomHeader,
} from '../models/RequestTypes';
import {
  SuccessResponse,
  ServerErrorResp,
  NotFoundResp,
  UnauthorizedResp,
} from '../types/ApiResponses';
import { INTERNAL_SERVER, NON_EXISTENT } from '../types/ErrorCodes';
import { log_info, log_error } from '../utils/log';
import { AdminModel } from '../models/Admin';
import callMicroHash from '../utils/callMicroHash';
import { HashHelper } from '../configs/HashHelper';
import { isHashErrorResponse } from '../helpers/MIcroHashHelper';
import { GetSetRequestProps } from '../utils/GetSetAppInRequest';

export const addAdmin: RequestHandler = async ({ body }: AddAdminReq, res) => {
  try {
    const { password, username } = body;

    NodeTlsHandler.disableTls();
    log_info('Call micro-node-crypt hashing service');
    const hashedPsw = await callMicroHash(password);
    log_info('Password hashed successfully');

    log_info(username, 'Creating new admin with name: ');
    const { _id: admin_id } = await AdminModel.create({
      username,
      password: hashedPsw,
    });
    log_info('Admin created with id: ' + admin_id);

    return new SuccessResponse(res);
  } catch (e) {
    log_error(e, 'Error creating new admin');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  } finally {
    NodeTlsHandler.enableTls();
  }
};

export const deleteAdmin: RequestHandler = async (
  { params: { adminId: _id } }: DeleteAdminReq,
  res
) => {
  try {
    log_info('Deleting admin with id: ' + _id);
    const adminToDelete = await AdminModel.findOne({ where: { _id } });
    if (!!!adminToDelete) {
      log_error("This Admin doesn't exists");
      return new NotFoundResp(res, NON_EXISTENT);
    }
    await adminToDelete.destroy();
    return new SuccessResponse(res);
  } catch (e) {
    log_error(e, 'Error deleting admin with id: ' + _id);
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};

export const areAdminActionsEnabled: RequestHandler = async (_, res, next) => {
  const base = 'Admin cruds are ';
  if (ADMIN_CRUDS) {
    log_info(base + 'allowed');
    return next();
  }
  return new UnauthorizedResp(res, base + 'deactivated');
};

export const getAdminByName: RequestHandler = async (req: AuthRequest, res, next) => {
  try {
    const {
      body: { username },
    } = req;
    log_info(`Getting Admin with username: ` + username);
    const foundAdmin = await AdminModel.findOne({ where: { username } });
    log_info('Success');

    if (!!!foundAdmin) {
      log_error("Admin doesn't exists");
      return new NotFoundResp(res, NON_EXISTENT);
    }

    GetSetRequestProps.setAdmin(req, foundAdmin);
    next();
  } catch (e) {
    log_error(e, 'Error Getting Admin');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};

export const getAdminToken: RequestHandler = async (req: AuthRequest, res) => {
  try {
    const { adminToken, username } = GetSetRequestProps.getAdmin(req);
    log_info(`Returning ${username} token`);
    return new SuccessResponse(res, { adminToken });
  } catch (e) {
    log_error(e, 'Error Getting Admin');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};

export const authenticateAdmin: RequestHandler = async (req: AuthRequest, res, next) => {
  try {
    const admin = GetSetRequestProps.getAdmin(req),
      { username, password } = req.body;
    log_info(`Starting authentication process for admin < ${username} >`);

    NodeTlsHandler.disableTls();
    const comparisonResult = await HashHelper.compareString(admin.password, password);

    if (isHashErrorResponse(comparisonResult)) {
      throw new Error('Micro Hash Helper: ' + comparisonResult.errors[0]);
    }

    if (comparisonResult.payload.compareResult) {
      log_info('Password matches, proceding to update admin token');
      return next();
    }

    log_info('Password does not match');
    return new UnauthorizedResp(res);
  } catch (e) {
    log_error(e, 'Authentication Error');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  } finally {
    NodeTlsHandler.enableTls();
  }
};

export const updateAdminToken: RequestHandler = async (req, res, next) => {
  try {
    const admin = GetSetRequestProps.getAdmin(req),
      { username } = admin;
    log_info(`Updating token for the user ${username}`);

    log_info('Call micro-node-crypt hashing service');
    admin.adminToken = await callMicroHash(username);
    log_info('Auth Token Generated');

    await admin.save();

    next();
  } catch (e) {
    log_error(e, 'Error updating user with new tokens');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};

export const isAdminTokenValid: RequestHandler = async (
  req: RequestWithCustomHeader<any, any, any, HeaderAdminToken>,
  res,
  next
) => {
  try {
    const {
      headers: { admintoken: adminToken },
    } = req;
    const foundAdmin = await AdminModel.findOne({ where: { adminToken } });
    if (!!!foundAdmin) {
      log_info('Admin Token Invalid');
      return new UnauthorizedResp(res);
    }
    log_info('Admin Token valid');
    next();
  } catch (e) {
    log_error(e, 'Error Validating Admin TOken');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};
