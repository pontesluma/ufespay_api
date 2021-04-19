import Transaction from '../models/Transaction.js';

class TransactionRepository {
  async create(data) {
    const newTransaction = new Transaction(data);
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

  async findById(id) {
    return Transaction.findById(id).populate('likes');
  }

  async save(transaction) {
    return transaction.save();
  }

  async delete(id) {
    await Transaction.deleteOne({ _id: id });
  }
}

export default TransactionRepository;