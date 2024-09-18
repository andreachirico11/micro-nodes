import { RequestHandler } from 'express';
import { isHashErrorResponse } from '../helpers/MIcroHashHelper';
import {
  AuthCheckRequest,
  AuthRequest,
  ChangePasswordRequest,
  ResetTokenRequest,
} from '../models/RequestTypes';
import { UserModel } from '../models/User';
import { UnauthorizedResp, SuccessResponse, ServerErrorResp } from '../types/ApiResponses';
import { INTERNAL_SERVER } from '../types/ErrorCodes';
import { GetSetRequestProps } from '../utils/GetSetAppInRequest';
import { getActualDateWithAddedMilliseconds, isDateInThePast } from '../utils/dates';
import { log_info, log_error } from '../utils/log';
import { NodeTlsHandler } from '../configs/Envs';
import { HashHelper } from '../configs/HashHelper';
import callMicroHash from '../utils/callMicroHash';

const generateTokenAndExp = async (
  baseString: string,
  millisecondsValidity: number
): Promise<[string, Date]> => {
  return [await callMicroHash(baseString), getActualDateWithAddedMilliseconds(millisecondsValidity)];
};

export const checkAuthToken: RequestHandler = async (req: AuthCheckRequest, res, next) => {
  try {
    const { _id: app_id } = GetSetRequestProps.getApp(req),
      {
        headers: { authorization: authToken },
      } = req;
    log_info(`Check if token << ${authToken} >> exists and is still valid`);
    const foundUser = await UserModel.findOne({ where: { authToken, app_id } });
    if (!!!foundUser) {
      log_error('No user for this token');
      return new UnauthorizedResp(res, 'Invalid token');
    }
    if (isDateInThePast(foundUser.dateTokenExp)) {
      log_error('Token has expired');
      return new UnauthorizedResp(res, 'Token is not valid anymore');
    }
    log_info('The token is still valid', `Found User With Name << ${foundUser.name} >>`);
    return new SuccessResponse(res);
  } catch (e) {
    log_error(e, 'Authentication Error');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};

export const onRefreshAuthToken: RequestHandler = async (req: AuthCheckRequest, res, next) => {
  try {
    const { _id: app_id, refreshToken: isFeatureActivated } = GetSetRequestProps.getApp(req),
      {
        headers: { authorization: refreshToken },
      } = req;
    if (!isFeatureActivated) {
      const phrase = 'The refresh feature is not activated on this app';
      log_error(phrase);
      return new UnauthorizedResp(res, phrase);
    }
    log_info(`Check if user with refresh token << ${refreshToken} >> exists`);
    const foundUser = await UserModel.findOne({ where: { refreshToken, app_id } });
    if (!!!foundUser) {
      log_error('No user for this token');
      return new UnauthorizedResp(res, 'Invalid token');
    }
    const tokenExpDate = new Date(foundUser.dateRefTokenExp);
    if (isDateInThePast(tokenExpDate)) {
      log_error('Token has expired');
      return new UnauthorizedResp(res, 'Token is not valid anymore');
    }
    log_info('The token is still valid', `Found User With Name << ${foundUser.name} >>`);
    GetSetRequestProps.setUser(req, foundUser);
    // GetSetRequestProps.setetSkipRefTkUpdate(req, true);
    next();
  } catch (e) {
    log_error(e, 'Authentication Error');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};

export const onResetTokenRequest: RequestHandler = async (req: ResetTokenRequest, res, next) => {
  try {
    const { _id: app_id } = GetSetRequestProps.getApp(req),
      {
        headers: { authorization: authToken },
      } = req;

    log_info(`Check if user with reset token << ${authToken} >> exists`);
    const foundUser = await UserModel.findOne({ where: { authToken, app_id } });
    if (!!!foundUser) {
      log_error('No user for this token');
      return new UnauthorizedResp(res, 'Invalid token');
    }
    const tokenExpDate = new Date(foundUser.dateRefTokenExp);
    if (isDateInThePast(tokenExpDate)) {
      log_error('Token has expired');
      return new UnauthorizedResp(res, 'Refresh Token is not valid anymore');
    }
    log_info('The token is still valid', `Found User With Name << ${foundUser.name} >>`);
    GetSetRequestProps.setUser(req, foundUser);
    GetSetRequestProps.setIsInResetTokenMode(req);
    next();
  } catch (e) {
    log_error(e, 'Authentication Error');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};

export const authenticateUser: RequestHandler = async (req: AuthRequest, res, next) => {
  try {
    const app = GetSetRequestProps.getApp(req),
      user = GetSetRequestProps.getUser(req),
      { username, password } = req.body;
    log_info(
      `Starting authentication process for username < ${username} > to application < ${app.name} >`
    );

    NodeTlsHandler.disableTls();
    const comparisonResult = await HashHelper.compareString(user.password, password);

    if (isHashErrorResponse(comparisonResult)) {
      throw new Error('Micro Hash Helper: ' + comparisonResult.errors[0]);
    }

    if (comparisonResult.payload.compareResult) {
      log_info('Password matches, proceding to update user');
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

export const changeUserPassword: RequestHandler = async (req: ChangePasswordRequest, res, next) => {
  try {
    const user = GetSetRequestProps.getUser(req),
      { newPassword } = req.body;

    NodeTlsHandler.disableTls();
    log_info('Call micro-node-crypt hashing service');
    user.password = await callMicroHash(newPassword);
    log_info('Password hashed successfully');

    user.datePasswordChange = new Date();
    await user.save();
    log_info('Password changed successfully');

    next();
  } catch (e) {
    log_error(e, 'Authentication Error');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  } finally {
    NodeTlsHandler.enableTls();
  }
};

export const updateUserTokens: RequestHandler = async (req, res, next) => {
  try {
    const user = GetSetRequestProps.getUser(req),
      {
        tokenExpirationMs,
        refreshTokenExpirationMs,
        resetTokeExpirationMs,
        refreshToken: appHasRefToken,
      } = GetSetRequestProps.getApp(req),
      skipRefTkUpdate = GetSetRequestProps.getSkipRefTkUpdate(req),
      updateRefreshToken = !skipRefTkUpdate && appHasRefToken;

    log_info(`Updating token for the user ${user.name}`);
    NodeTlsHandler.disableTls();
    log_info('Call micro-node-crypt hashing service');

    if (GetSetRequestProps.isInResetTokenMode(req)) {
      const [resetToken, dateResetTokenExp] = await generateTokenAndExp(
        user.name,
        resetTokeExpirationMs
      );
      await user.update({ resetToken, dateResetTokenExp });
    } else {
      const [authToken, dateTokenExp] = await generateTokenAndExp(user.name, tokenExpirationMs);
      const [refreshToken, dateRefTokenExp] = updateRefreshToken
        ? await generateTokenAndExp(user.name, refreshTokenExpirationMs)
        : [];
      await user.update({
        authToken,
        dateTokenExp,
        resetToken: null,
        dateResetTokenExp: null,
        ...(updateRefreshToken && { refreshToken, dateRefTokenExp }),
      });
    }
    next();
  } catch (e) {
    log_error(e, 'Error updating user with new tokens');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  } finally {
    NodeTlsHandler.enableTls();
  }
};

export const getUserToken: RequestHandler = async (req: AuthRequest, res) => {
  try {
    const {
        name,
        authToken,
        dateTokenExp,
        refreshToken,
        dateRefTokenExp,
        resetToken,
        dateResetTokenExp,
      } = GetSetRequestProps.getUser(req),
      { refreshToken: appHasRefToken } = GetSetRequestProps.getApp(req);
    log_info(`Returning ${name} tokens`);

    if (GetSetRequestProps.isInResetTokenMode(req)) {
      return new SuccessResponse(res, {
        resetToken,
        dateResetTokenExp,
      });
    }

    return new SuccessResponse(res, {
      authToken,
      dateTokenExp,
      ...(appHasRefToken && { refreshToken, dateRefTokenExp }),
    });
  } catch (e) {
    log_error(e, 'Error Getting User');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  } finally {
    GetSetRequestProps.resetFlags(req);
  }
};
