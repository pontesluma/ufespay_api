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

  async list(req, res) {
    const { userId } = req;

    const users = await User.find({ _id: { $ne: String(userId) } }, 'name email');

    return res.status(200).json({ users })
  }

  async update(req, res) {
    const { userId } = req;
    const { name, email, newPassword, password } = req.body;

    const user = await User.findById(userId);

    if(newPassword && user.password !== password) {
      return res.status(400).json({ message: 'Wrong password.' });
    } 

    const newUserData = { name, email, password: newPassword };

    Object.keys(newUserData).forEach(key => {
      if (!newUserData[key]) delete newUserData[key];
    });

    const changedUser = await User.findByIdAndUpdate(
      userId,
      { ...newUserData, updated_at: new Date() },
      (err, result) => {
        if(err){
            return res.status(500).json({ err, message: 'Something went wrong!' });
        }
      }
    );

    const updatedUser = await changedUser.save();

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