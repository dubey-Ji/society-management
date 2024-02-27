import { Router } from 'express';
import { userController } from '../controller/user.controller.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.route('/register').post(userController.registerUser);

router.route('/').get(userController.fetchAllUsers);

router.route('/login').post(userController.login);

router.route('/logout').post(verifyJwt, userController.logout);

router.route('/registerusers').post(
  upload.fields([
    {
      name: 'users',
      maxCount: 1,
    },
  ]),
  userController.registerUserWithXlsx
);

export default router;
