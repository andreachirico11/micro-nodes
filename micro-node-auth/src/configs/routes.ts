import { Router } from "express";
import { isAdminTokenValid, getAdminByName, authenticateAdmin, updateAdminToken, getAdminToken, deleteAdmin, addAdmin, areAdminActionsEnabled } from "../controllers/admins";
import { addApp, getAppById, updateApp, deleteApp, getAppIfApikeyIsValid, getAllApps } from "../controllers/apps";
import { pingExternalSevices, getPing, getPingDb } from "../controllers/ping";
import { cascadeDeleteUsers, getUserByNameAndAppAndContinue, getUserByIdAndContinue, returnUser, getAllUsers, addUser, updateUser, deleteUser } from "../controllers/users";
import { getRequestBodyValidator, checkAppPasswordRequirementsForNewUser, checkAppPasswordRequirementsForPasswordChange } from "../controllers/validators";
import { adminCreation } from "../utils/validators/Admin";
import { appCreation, appUpdate } from "../utils/validators/App";
import { userAuth, userCreation, userPasswordChange, userUpdate } from "../utils/validators/User";
import { onRefreshAuthToken, updateUserTokens, getUserToken, authenticateUser, getUserFromValidToken, onResetTokenRequest, changeUserPassword, returnTrueifUserIsPresent } from "../controllers/auth";
import { configRequest, unsupportedUrl } from "micro-nodes-shared";

const router = Router();

router.all('*', configRequest);

const appRouter = Router();
appRouter.post('/', getRequestBodyValidator(appCreation), addApp);
appRouter.put('/:appId', getAppById, getRequestBodyValidator(appUpdate), updateApp);
appRouter.delete('/:appId', getAppById, cascadeDeleteUsers, deleteApp);
appRouter.get('/:appId', getAppById);
appRouter.get('/', getAllApps);
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
// TODO: finire
// authRouter.get(
//   '/reset',
//   onResetTokenRequest,
//   updateUserTokens,
//   getUserToken
// ); 
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
authRouter.get('/', getUserFromValidToken, returnTrueifUserIsPresent);
router.use('/auth', getAppIfApikeyIsValid, authRouter);


const adminRouter = Router();
adminRouter.delete('/:adminId', deleteAdmin);
adminRouter.post('/', getRequestBodyValidator(adminCreation), addAdmin);
router.use('/admin', areAdminActionsEnabled, adminRouter);

const userRouter = Router();
userRouter.get('/me', getUserFromValidToken, returnUser);
router.use('/user',  getAppIfApikeyIsValid, userRouter);

const userAdminRouter = Router();
userRouter.post('/', getRequestBodyValidator(userCreation), checkAppPasswordRequirementsForNewUser, addUser);
userRouter.put(
  '/:userId',
  getRequestBodyValidator(userUpdate),
  getUserByIdAndContinue,
  updateUser
);
userRouter.delete('/:userId', getUserByIdAndContinue, deleteUser);
router.use('/user', isAdminTokenValid, getAppIfApikeyIsValid, userAdminRouter);
router.get('/allUsers', isAdminTokenValid, getAllUsers);


router.get('/ping/db', getPingDb);
router.get('/ping/ext', pingExternalSevices);
router.get('/ping', getPing);

router.use('*', unsupportedUrl);

export default router;
