import Transaction from '../models/Transaction.js';

class TransactionRepository {
  async create(value,message, emitter, receiver) {
    const newTransaction = new Transaction({value,message, emitter :userId, receiver :userId});
    await newTransaction.save();
    return newTransaction;
  }

  async delete(id) {
    await Transaction.deleteOne({ _id: id });
  }

  async update(transaction){
    transaction.save();
  }

  async retrieveById(transaction){
    return await Transaction.findById(transaction._id); 
  }
}

export default TransactionRepository;