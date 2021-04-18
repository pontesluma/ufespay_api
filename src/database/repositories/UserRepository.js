import User from '../models/User.js';

class UserRepository {
  async create(name, email, password, walletId) {
    const newUser = new User({ name, email, password, wallet: walletId });
    await newUser.save();
    delete newUser.password;
    return newUser;
  }

  async list() {
    return await User.find({});
  }

  async findByEmail(email) {
    const user = await User.findOne({ email: email }, 'id name email wallet password').populate('wallet').exec();
    return user;
  }

  async findByName(name) {
    const user = await User.find({ name: name }, 'id name email wallet password').populate('wallet').exec();
    return user;
  }

  async findById(id) {
    const user = await User.findById(id, 'id name email wallet').populate('wallet').exec();
    return user;
  }

  async delete(email) {
    await User.deleteOne({ email });
  }

}

export default UserRepository;