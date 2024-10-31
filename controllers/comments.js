import Comment from "../models/comment.js";

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({}).populate("owner").populate("post");

    if (!comments.length) {
      return res.status(404).json({ message: "No comments at the moment" });
    }

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCommentsById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId)
      .populate("owner")
      .populate("post");

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createComment = async (req, res) => {
  const { owner, postId, text } = req.body;
  try {
    const newComment = new Comment({ owner, postId, text });
    const savedComment = await newComment.save();
    const populatedComment = await savedComment.populate("owner");

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      req.body,
      { new: true }
    );
    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(
      req.params.commentId
    );
    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
