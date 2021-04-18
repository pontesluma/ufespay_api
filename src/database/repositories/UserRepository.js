import User from '../models/User.js';

class UserRepository {
  async create(name, email, password, walletId) {
    const newUser = new User({ name, email, password, wallet: walletId });
    await newUser.save();
    delete newUser.password;
    return newUser;
  }
  
  async findByEmail(email) {
    const user = await User.findOne({ email: email }, 'id name email wallet password').populate('wallet').exec();
    return user;
  }

  async findById(id) {
    const user = await User.findById(id, 'id name email wallet password').populate('wallet').exec();
    return user;
  }

  async getOthers(userId) {
    return User.find({ _id: { $ne: String(userId) } }, 'name email');
  }

  async update(userId, newUserData){
    const changedUser = await User.findByIdAndUpdate(
      userId,
      newUserData,
    );

    const updatedUser = await changedUser.save();

    return updatedUser;
  }

  async delete(email) {
    await User.deleteOne({ email });
  }

}

export default UserRepository;