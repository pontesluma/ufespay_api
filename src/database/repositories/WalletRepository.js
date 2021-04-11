import Wallet from '../models/Wallet.js';

class WalletRepository {
  async create() {
    const newWallet = new Wallet({});
    await newWallet.save();
    return newWallet;
  }

  async delete(id) {
    await Wallet.deleteOne({ _id: id });
  }
}

export default WalletRepository;