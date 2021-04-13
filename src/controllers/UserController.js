import User from '../database/models/User.js';
import UserRepository from '../database/repositories/UserRepository.js';
import WalletRepository from '../database/repositories/WalletRepository.js';

// get user (self)
// delete user OK
// create user OK
// update user
// get user (name or username filter)

class UserController {
  async create(req, res) {
    const { name, email, password } = req.body;

    const userRepository = new UserRepository();
    const walletRepository = new WalletRepository();

    // check if email already exist
    const existentUser = await userRepository.findByEmail(email);

    if (existentUser) {
      return res.status(400).json({ message: 'E-mail already in use.'});
    }

    // create wallet
    const wallet = await walletRepository.create();

    // create user
    const user = await userRepository.create(name, email, password, wallet._id);

     return res.status(200).json({ user })
  }

  async delete(req, res) {
    const { email } = req.body;
    
    const userRepository = new UserRepository();
    const walletRepository = new WalletRepository();

    // check if email exists
    const user = await userRepository.findByEmail(email);

    if (!user) {
      return res.status(400).json({ message: 'User do not exist.'});
    }

    // delete wallet
    await walletRepository.delete(user.wallet);

    // delete user
    await userRepository.delete(user.email);

    return res.status(200).send();
  }
}

export default UserController;