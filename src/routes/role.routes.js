import { Router } from 'express';
import { roleController } from '../controller/role.controller.js';

const router = Router();

router.route('/').post(roleController.create);

router.route('/').get(roleController.fetchAllRoles);

export default router;
