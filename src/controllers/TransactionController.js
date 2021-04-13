import User from '../database/models/User.js';
import UserRepository from '../database/repositories/UserRepository.js';
import WalletRepository from '../database/repositories/WalletRepository.js';
import Transaction from '../database/models/Transaction.js';
import TransactionRepository from '../database/repositories/TransactionRepository.js';
import CommentRepository from '../database/repositories/CommentRepository.js';

class TransactionController {


    async create(req, res) {
        const { value, message, emitterEmail, receiverEmail } = req.body;

        const userRepository = new UserRepository();
        const walletRepository = new WalletRepository();
        const transactionRepository = new TransactionRepository();
        
        // get emitter and receiver users 
        const userEmitter = await userRepository.findByEmail(emitterEmail);
        const userReceiver = await userRepository.findByEmail(receiverEmail);
        if (userEmitter.wallet.value >= value){
             // enought value at emitter walet
             //subtract value from Emitter´s wallet and save to database
             userEmitter.wallet.value = userEmitter.wallet.value - value;
             walletRepository.update(userEmitter.wallet,userEmitter.wallet.value);

             //add value from Receiver´s wallet and save to database
             userReceiver.wallet.value = userReceiver.wallet.value + value;
             walletRepository.update(userReceiver.wallet,userReceiver.wallet.value);

             //create new transaction
             const newTransaction = transactionRepository.create(value,message,userEmitter._id, userReceiver._id);

            //add the new transation into Emitter and Receiver wallets
            //how save it to database? 
            userEmitter.wallet.transactions.push(newTransaction);
            userReceiver.wallet.transactions.push(newTransaction);

             return res.status(200).json({ newTransaction })
        }else{
            // insufficient value at emitter walet 
            return res.status(400).json({ message: 'Emitter does not have enought wallet amount for transaction'});
        }
    }
async getAllUserTransactions(req, res) {
        const userRepository = new UserRepository();
        //required: user´s email
        const { email } = req.body;
    
        //find user
        const user = await userRepository.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'User do not exist.'});
        }else{
            //return list user´s transactions
            return res.status(200).json(user.wallet.transactions);
        }   
        return res.status(200).send();
    }

async getAddTransactionComment(req, res) {
        const userRepository = new UserRepository();
        const commentRepository = new CommentRepository();
        const transactionRepository = new TransactionRepository();
        //required: author´s email, comment´s text, and Transaction ID
        const { authorEmail , text, transactionId } = req.body;
        
    
        //find author
        const user = await userRepository.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'User do not exist.'});
        }else{
            //find user´s transaction to add comment
            const transaction;
            user.wallet.transactions.find((transaction) => {
                if (transaction._id == transactionId)
                    return transaction;
            });
            //create comment
            const newComment = commentRepository.create(text,user._id);
            //add commnent to transaction
            transaction.push(newComment);
            //save transaction on database
            transactionRepository.update(transaction);

            return res.status(200).json(newComment);
        }   
        return res.status(200).send();
    }
async likeTransaction(req, res) {
        const commentRepository = new CommentRepository();
        const transactionRepository = new TransactionRepository();
        const userRepository = new UserRepository();
        //required: transaction´s ID and user email
        const {  transactionId , userEmail } = req.body;
        
        //find transaction
        const transaction = await transactionRepository.retrieveById(transactionId);
        const user = userRepository.findByEmail(userEmail);
        if (!((transaction)^(user))) {
            return res.status(400).json({ message: 'Transaction or user not found.'});
        }else{
            //add user into transaction liked list
            transaction.likes.push(user);
            //save transaction
            transactionRepository.update(transaction);
            // return updated transaction
            return res.status(200).json(transaction);
        }
    }
    
    async unlikeTransaction(req, res) {
        const commentRepository = new CommentRepository();
        const transactionRepository = new TransactionRepository();
        const userRepository = new UserRepository();
        //required: transaction´s ID and user email
        const {  transactionId , userEmail } = req.body;
        
        //retrieve transaction
        const transaction = await transactionRepository.retrieveById(transactionId);
        //retrived user
        const user = userRepository.findByEmail(userEmail);
        //if transation or user are not found
        if (!((transaction)^(user))) {
            return res.status(400).json({ message: 'Transaction or user not found.'});
        }else{
            //if transanction and user are found
            //remove user from transaction liked list
            transaction.likes = transaction.likes.filter((value)=>{
                return value._id =! user._id;
            });
            //save transaction
            transactionRepository.update(transaction);
            // return updated transaction
            return res.status(200).json(transaction);
        }
    }

    async removeTransactionComment(req, res) {
        const commentRepository = new CommentRepository();
        const transactionRepository = new TransactionRepository();
        //required: transaction and comment ID 
        const {  transactionId , commentId } = req.body;
        
        //find transaction
        const transaction = await transactionRepository.retrieveById(transactionId);
        //find comment
        const comment = await commentRepository.retrieveById(commentId);
        
        if (!((transaction)^(comment))) {
            return res.status(400).json({ message: 'Transaction or comment not found.'});
        }else{
            //if transanction and comment are found
            //remove comment from transaction comments list
            transaction.comments = transaction.comments.filter((value)=>{
                return value._id =! commentId;
            });
            //save transaction
            transactionRepository.update(transaction);

            //delete comment
            commentRepository.deleteById(commentId);

            // return updated transaction
            return res.status(200).json(transaction);
        }
    }
}    


export default TransactionController;



