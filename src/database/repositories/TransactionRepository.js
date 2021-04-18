import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import Comment from '../models/Comment.js';

class TransactionRepository {
  async create() {
    const newTransaction = new Transaction({});
    await newTransaction.save();
    return newTransaction;
  }

  async getAll() {
    const transaction = await Transaction.find({})
      .populate('emitter receiver', 'name email')
      .populate('comments')
      .populate({
        path : 'comments',
        populate : {
          path : 'author',
          select: 'name email'
        }
      })
      .exec();
    return transaction;
  }

  async delete(id) {
    await Transaction.deleteOne({ _id: id });
  }
}

export default TransactionRepository;