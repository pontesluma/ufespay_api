import { Router } from 'express';

import UserController from '../controllers/UserController.js';

const userController = new UserController();

const routes = Router();

routes.post('/user', userController.create);
routes.delete('/user', userController.delete);

export default routes;