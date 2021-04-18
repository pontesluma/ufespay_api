import mongoose from 'mongoose';

const WalletSchema = new mongoose.Schema({
  balance: { type: Number, default: 3000 },
});

const Wallet = mongoose.model('Wallet', WalletSchema);

export default Wallet;