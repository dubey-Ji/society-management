import { Router } from 'express';
import { userController } from '../controller/user.controller.js';

const router = Router();

router.route('/register').post(userController.registerUser);

export default router;
