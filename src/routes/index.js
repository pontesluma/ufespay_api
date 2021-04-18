import { Router } from 'express';

import ensureAuth from '../middlewares/ensureAuth.js'

import UserController from '../controllers/UserController.js';
import SessionController from '../controllers/SessionController.js';
import TransactionController from '../controllers/TransactionController.js';
import CommentController from '../controllers/CommentController.js';

import UserRepository from '../database/repositories/UserRepository.js';
import WalletRepository from '../database/repositories/WalletRepository.js';
import TransactionRepository from '../database/repositories/TransactionRepository.js';
import CommentRepository from '../database/repositories/CommentRepository.js';

const userController = new UserController();
const sessionController = new SessionController();
const transactionController = new TransactionController();
const commentController = new CommentController();

const userRepository = new UserRepository();
const walletRepository = new WalletRepository();
const transactionRepository = new TransactionRepository();
const commentRepository = new CommentRepository();

userController.setDependencies(userRepository, walletRepository)
sessionController.setDependencies(userRepository)
transactionController.setDependencies(transactionRepository, userRepository, walletRepository)
commentController.setDependencies(transactionRepository, commentRepository)

const routes = Router();

routes.post('/sign-in', (req,res) => sessionController.signIn(req,res));
routes.delete('/sign-out', (req,res) => sessionController.signOut(req,res));

routes.post('/user', (req,res) => userController.create(req,res));
routes.delete('/user', ensureAuth, (req,res) => userController.delete(req,res));
routes.get('/user', ensureAuth, (req,res) => userController.index(req,res));
routes.put('/user', ensureAuth, (req,res) => userController.update(req,res));

routes.get('/users', ensureAuth, (req,res) => userController.list(req,res));

routes.get('/transaction', ensureAuth, (req,res) => transactionController.list(req,res));
routes.post('/transaction', ensureAuth, (req,res) => transactionController.create(req,res));

routes.put('/like', ensureAuth, (req,res) => transactionController.toggleLike(req,res));
routes.post('/comment', ensureAuth, (req,res) => commentController.create(req,res));
routes.delete('/comment', ensureAuth, (req,res) => commentController.delete(req,res));


export default routes;