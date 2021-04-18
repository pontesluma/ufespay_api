// get transactions (?all=1)
// create a transaction
// comment transaction
// delete transaction comment
// like transaction
// unlike transaction

import User from '../database/models/User.js';
import Wallet from '../database/models/Wallet.js';
import Transaction from '../database/models/Transaction.js';
import Comment from '../database/models/Comment.js';
import TransactionRepository from '../database/repositories/TransactionRepository.js';
import UserRepository from '../database/repositories/UserRepository.js';

// get user (self) OK
// delete user OK
// create user OK
// update user
// get user (name)

class TransactionController {
  async teste(req, res) {
    User.remove({}, () => console.log('User removed'));
    Comment.remove({}, () => console.log('Comment removed'));
    Wallet.remove({}, () => console.log('Wallet removed'));
    Transaction.remove({}, () => console.log('Transaction removed'));
    return res.status(200).send();
  }

  async list(req, res) {
    const transactionRepository = new TransactionRepository();

    const transactions = await transactionRepository.getAll();

    return res.status(200).json({ transactions })
  }

  async create(req, res) {
    const { receiverId, value, message } = req.body;
    const { userId } = req;

    const userRepository = new UserRepository();

    // check if email already exist
    const emitter = await userRepository.findById(userId);
    const receiver = await userRepository.findById(receiverId);

    if (!emitter || !receiver) {
      return res.status(400).json({ message: 'Users not found.'});
    }

    const emitterWallet = await Wallet.findById(emitter.wallet);
    const receiverWallet = await Wallet.findById(receiver.wallet);

    if (emitterWallet.balance < value) {
      return res.status(400).json({ message: 'Not enought money'});
    }

    const newTransaction = new Transaction({
      message,
      emitter,
      receiver,
      value,
      likes: [],
      comments: [],
      created_at: new Date(),
    });

    const transaction = await newTransaction.save();

    emitterWallet.balance = emitterWallet.balance - value;
    emitterWallet.save()

    receiverWallet.balance = receiverWallet.balance + value;
    receiverWallet.save()

    return res.status(200).json({ transaction })
  }

  async toggleLike(req, res) {
    const { userId } = req;
    const { transactionId } = req.body;

    
    
    const transaction = await Transaction.findById(transactionId).populate('likes');

    if (!transaction) {
      return res.status(400).json({ message: 'Transaction not found.'});
    }

    const alreadyLiked = transaction.likes.filter(
      likeAuthor => String(likeAuthor._id) === String(userId)
    );

    if (alreadyLiked.length) {
      transaction.likes = transaction.likes.filter(likeAuthor => likeAuthor._id === userId);
      await transaction.save()
      return res.status(200).send();
    }

    transaction.likes.push(userId);
    await transaction.save();

    return res.status(200).send();
  }

}

export default TransactionController;