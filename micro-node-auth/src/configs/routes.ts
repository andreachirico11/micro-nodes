import { Router } from "express";
import { isAdminTokenValid, getAdminByName, authenticateAdmin, updateAdminToken, getAdminToken, deleteAdmin, addAdmin, areAdminActionsEnabled } from "../controllers/admins";
import { addApp, getAppById, updateApp, deleteApp, getAppIfApikeyIsValid } from "../controllers/apps";
import { pingExternalSevices, getPing } from "../controllers/ping";
import { unsupportedUrl } from "../controllers/unsuportedUrl";
import { cascadeDeleteUsers, getUserByNameAndAppAndContinue, getUserByIdAndContinue, returnUser, getAllUsers, addUser, updateUser, deleteUser } from "../controllers/users";
import { configRequest } from "../controllers/utils";
import { getRequestBodyValidator, checkAppPasswordRequirementsForNewUser, checkAppPasswordRequirementsForPasswordChange } from "../controllers/validators";
import { adminCreation } from "../utils/validators/Admin";
import { appCreation, appUpdate } from "../utils/validators/App";
import { userAuth, userCreation, userPasswordChange, userUpdate } from "../utils/validators/User";
import { onRefreshAuthToken, updateUserTokens, getUserToken, authenticateUser, checkAuthToken, onResetTokenRequest, changeUserPassword } from "../controllers/auth";

const router = Router();

router.all('*', configRequest);

const appRouter = Router();
appRouter.post('/', getRequestBodyValidator(appCreation), addApp);
appRouter.put('/:appId', getAppById, getRequestBodyValidator(appUpdate), updateApp);
appRouter.delete('/:appId', getAppById, cascadeDeleteUsers, deleteApp);
router.use('/app', isAdminTokenValid, appRouter);

router.post('/auth/admin',   getRequestBodyValidator(userAuth),
getAdminByName,
authenticateAdmin,
updateAdminToken,
getAdminToken);
const authRouter = Router();
authRouter.get(
  '/refresh',
  onRefreshAuthToken,
  updateUserTokens,
  getUserToken
);
authRouter.get(
  '/reset',
  onResetTokenRequest,
  updateUserTokens,
  getUserToken
);
authRouter.post(
  '/reset',
  getRequestBodyValidator(userPasswordChange),
  checkAppPasswordRequirementsForPasswordChange,
  getUserByNameAndAppAndContinue,
  authenticateUser,
  changeUserPassword,
  updateUserTokens,
  getUserToken
);
authRouter.post(
  '/',
  getRequestBodyValidator(userAuth),
  getUserByNameAndAppAndContinue,
  authenticateUser,
  updateUserTokens,
  getUserToken
);
authRouter.get('/', checkAuthToken);
router.use('/auth', getAppIfApikeyIsValid, authRouter);


const adminRouter = Router();
adminRouter.delete('/:adminId', deleteAdmin);
adminRouter.post('/', getRequestBodyValidator(adminCreation), addAdmin);
router.use('/admin', areAdminActionsEnabled, adminRouter);

const userRouter = Router();
userRouter.get('/:userId', getUserByIdAndContinue, returnUser);
userRouter.get('/', getAllUsers);
userRouter.post('/', getRequestBodyValidator(userCreation), checkAppPasswordRequirementsForNewUser, addUser);
userRouter.put(
  '/:userId',
  getRequestBodyValidator(userUpdate),
  getUserByIdAndContinue,
  updateUser
);
userRouter.delete('/:userId', getUserByIdAndContinue, deleteUser);
router.use('/user', getAppIfApikeyIsValid, userRouter);

router.get('/ping/ext', pingExternalSevices);
router.get('/ping', getPing);

router.use('*', unsupportedUrl);

export default router;
