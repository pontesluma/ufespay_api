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
  
  async update(id, newValue) {
    await Wallet.findOneAndUpdate({ _id: id }, {value : newValue})
  }

  async getWalletTransactions(id, newValue) {
    await Wallet.findOneAndUpdate({ _id: id }, {value : newValue})
  }
}

export default WalletRepository;