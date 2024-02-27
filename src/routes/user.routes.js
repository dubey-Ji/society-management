import { Router } from 'express';
import { userController } from '../controller/user.controller.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/register').post(userController.registerUser);

router.route('/').get(userController.fetchAllUsers);

router.route('/login').post(userController.login);

router.route('/logout').post(verifyJwt, userController.logout);

export default router;
