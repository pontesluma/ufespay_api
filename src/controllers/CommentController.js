import Comment from '../database/models/Comment.js';
import Transaction from '../database/models/Transaction.js';


class CommentController {
  async create(req, res) {
    const { text, transactionId } = req.body;
    const { userId } = req;

    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(400).json({ message: 'Invalid transaction'});
    }

    const newComment = new Comment({text, author: userId});
    const {_id} = await newComment.save();
    const comment = await Comment.findById(_id)
      .populate({path : 'author', select: 'name email'});

    transaction.comments.push(comment);
    await transaction.save();

    return res.status(200).json({ comment })
  }


  async delete(req, res) {
    const { userId } = req;
    const { id } = req.query;

    
    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(400).json({ message: 'Comment not found.'});
    }

    if (userId !== String(comment.author)) {
      return res.status(400).json({ message: 'You cannot delete this comment.'});
    }

    await Comment.deleteOne({_id: id});

    return res.status(200).send();
  }
}

export default CommentController;