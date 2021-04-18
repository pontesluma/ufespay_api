import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  message: { type: String },
  value: { type: Number },
  emitter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  created_at: { type: Date, default: new Date() },
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

export default Transaction;