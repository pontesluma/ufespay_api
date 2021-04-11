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
    const user = await User.findOne({ email: email }, 'id name email wallet').exec();
    return user;
  }

  async delete(email) {
    await User.deleteOne({ email });
  }

}

export default UserRepository;