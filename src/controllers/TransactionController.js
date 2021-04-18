class TransactionController {
  setDependencies(transactionRepository, userRepository, walletRepository){
    this.transactionRepository = transactionRepository;
    this.userRepository = userRepository;
    this.walletRepository = walletRepository;
  }

  async list(req, res) {
    try {
      const transactions = await this.transactionRepository.getAll();
  
      return res.status(200).json({ transactions });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: 'Something went wrong!' });
    }
  }

  async create(req, res) {
    try {
      const { receiverId, value, message } = req.body;
      const { userId } = req;

      // check if email already exist
      const emitter = await this.userRepository.findById(userId);
      const receiver = await this.userRepository.findById(receiverId);

      if (!emitter || !receiver) {
        return res.status(400).json({ message: 'Users not found.'});
      }

      const emitterWallet = await this.walletRepository.findById(emitter.wallet);
      const receiverWallet = await this.walletRepository.findById(receiver.wallet);

      if (emitterWallet.balance < value) {
        return res.status(400).json({ message: 'Not enought money'});
      }

      const transaction = await this.transactionRepository.create({
        message,
        emitter,
        receiver,
        value,
        likes: [],
        comments: [],
        created_at: new Date(),
      });

      emitterWallet.balance = emitterWallet.balance - value;
      await this.walletRepository.save(emitterWallet);

      receiverWallet.balance = receiverWallet.balance + value;
      await  this.walletRepository.save(receiverWallet);

      return res.status(200).json({ transaction });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: 'Something went wrong!' });
    }
  }

  async toggleLike(req, res) {
    try {
      const { userId } = req;
      const { transactionId } = req.body;

      const transaction = await this.transactionRepository.findById(transactionId);

      if (!transaction) {
        return res.status(400).json({ message: 'Transaction not found.'});
      }

      const alreadyLiked = transaction.likes.filter(
        likeAuthor => String(likeAuthor._id) === String(userId)
      );

      if (alreadyLiked.length) {
        transaction.likes = transaction.likes.filter(likeAuthor => likeAuthor._id === userId);
        await this.transactionRepository.save(transaction);
        return res.status(200).send();
      }

      transaction.likes.push(userId);
      await this.transactionRepository.save(transaction);

      return res.status(200).send();
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: 'Something went wrong!' });
    }
    
  }

}

export default TransactionController;