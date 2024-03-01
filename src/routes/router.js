import { Router } from 'express';
import roleRouter from './role.routes.js';
import userRouter from './user.routes.js';

const router = Router();

router.use('/users', userRouter);
router.use('/roles', roleRouter);

export default router;
