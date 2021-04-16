import { Router } from 'express';

import ensureAuth from '../middlewares/ensureAuth.js'
import UserController from '../controllers/UserController.js';
import SessionController from '../controllers/SessionController.js';

const userController = new UserController();
const sessionController = new SessionController();

const routes = Router();

routes.post('/sign-in', sessionController.signIn);
routes.delete('/sign-out', sessionController.signOut);

routes.post('/user', userController.create);
routes.delete('/user', ensureAuth, userController.delete);
routes.get('/user', ensureAuth, userController.index);
routes.put('/user', ensureAuth, userController.update);

export default routes;