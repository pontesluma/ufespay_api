import { Router } from 'express';

import ensureAuth from '../middlewares/ensureAuth.js'
import UserController from '../controllers/UserController.js';
import SessionController from '../controllers/SessionController.js';
import TransactionController from '../controllers/TransactionController.js';
import CommentController from '../controllers/CommentController.js';

const userController = new UserController();
const sessionController = new SessionController();
const transactionController = new TransactionController();
const commentController = new CommentController();

const routes = Router();

routes.post('/sign-in', sessionController.signIn);
routes.delete('/sign-out', sessionController.signOut);

routes.post('/user', userController.create);
routes.delete('/user', ensureAuth, userController.delete);
routes.get('/user', ensureAuth, userController.index);
routes.put('/user', ensureAuth, userController.update);

routes.get('/users', ensureAuth, userController.list);

routes.get('/transaction', ensureAuth, transactionController.list);
routes.post('/transaction', ensureAuth, transactionController.create);
routes.put('/like', ensureAuth, transactionController.toggleLike);
routes.delete('/teste', transactionController.teste);

routes.post('/comment', ensureAuth, commentController.create);
routes.delete('/comment', ensureAuth, commentController.delete);


export default routes;