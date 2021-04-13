import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  value: { type: Number, default: 0 },
  message: { type: String },
  emitter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

export default Transaction;