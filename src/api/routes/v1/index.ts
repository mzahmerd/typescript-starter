import { Router } from 'express';
import mainRouter from './main';
import usersRouter from './users';
import rolesRouter from './roles';
import utilityRouter from './utility';

const router: Router = Router();
router.use('/', mainRouter);
router.use('/users', usersRouter);
router.use('/roles', rolesRouter);
router.use('/utility', utilityRouter);

export default router;
