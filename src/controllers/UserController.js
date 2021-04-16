import User from '../database/models/User.js';
import UserRepository from '../database/repositories/UserRepository.js';
import WalletRepository from '../database/repositories/WalletRepository.js';

// get user (self) OK
// delete user OK
// create user OK
// update user
// get user (name)

class UserController {
  async create(req, res) {
    const { name, email, password } = req.body;

    console.log('crearte:', { name, email, password })

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

  async index(req, res) {
    const { userId } = req;

    const userRepository = new UserRepository();

    const user = await userRepository.findById(userId);

    if (!user) {
      return res.status(400).json({ message: 'User do not exist.'});
    }

    return res.status(200).json({ user })
  }

  // async list(req, res) {
  //   const { name } = req.params;

  //   const userRepository = new UserRepository();

  //   const user = await userRepository.findById(userId);

  //   if (!user) {
  //     return res.status(400).json({ message: 'User do not exist.'});
  //   }

  //   return res.status(200).json({ user })
  // }

  async update(req, res) {
    const { userId } = req;
    const { name, email, password } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, password, updated_at: new Date() },
      (err, result) => {
        if(err){
            return res.status(500).json({ err, message: 'Something went wrong!' });
        }
      }
    );

    const updatedUser = await user.save();

    return res.status(200).json({ user: updatedUser })
  }

  async delete(req, res) {
    const { userId } = req;
    
    const userRepository = new UserRepository();
    const walletRepository = new WalletRepository();

    // get user
    const user = await userRepository.findById(userId);

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