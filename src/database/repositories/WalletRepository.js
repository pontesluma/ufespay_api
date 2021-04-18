import Wallet from '../models/Wallet.js';

class WalletRepository {
  async create() {
    const newWallet = new Wallet({});
    await newWallet.save();
    return newWallet;
  }

  async findById(id) {
    return Wallet.findById(id);
  }

  async save(user) {
    return user.save();
  }

  async delete(id) {
    await Wallet.deleteOne({ _id: id });
  }
}

export default WalletRepository;