import Comment from '../models/Comment.js';

class CommentRepository {
  async create(data){
    const newComment = new Comment(data);
    const {_id} = await newComment.save();
    const comment = await Comment.findById(_id)
      .populate({path : 'author', select: 'name email'});

    return comment;
  }

  async findById(id){
    return Comment.findById(id);
  }

  async delete(id){
    return Comment.deleteOne({_id: id});
  }
}

export default CommentRepository;