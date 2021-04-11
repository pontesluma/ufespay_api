import mongoose from 'mongoose';

const WalletSchema = new mongoose.Schema({
  value: { type: Number, default: 30000 },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
});

const Wallet = mongoose.model('Wallet', WalletSchema);

export default Wallet;