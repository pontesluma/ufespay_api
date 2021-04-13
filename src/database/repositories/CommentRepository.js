import Comment from '../models/Comment.js';

class CommentRepository {
  async create(text, author) {
    const newComment = new Comment({text,author : userId});
    await newComment.save();
    return newComment;
  }

  async retrieveById(commentId) {
    return await Comment.findOne({_id = commentId}).exec();
  }

  async deleteById(commentId) {
    return await Comment.deleteOne({_id = commentId}).exec();
  }
}

export default CommentRepository;