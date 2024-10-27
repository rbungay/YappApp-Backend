import Post from "../models/post.js";
import Prompt from "../models/prompt.js";
import Comment from "../models/comment.js";
import Vote from "../models/vote.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("owner")
      .populate("prompt")
      .populate("countUp")
      .populate("countDown")
      .populate({
        path: "comments",
        populate: { path: "owner", select: "username" },
      });

    if (!posts.length) {
      return res.status(404).json({ message: "No posts at the moment" });
    }

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPostsByPrompt = async (req, res) => {
  const { promptId } = req.params;
  try {
    const posts = await Post.find({ prompt: promptId })
      .populate("owner")
      .populate({
        path: "comments",
        populate: { path: "owner", select: "username" },
      });

    if (!posts.length) {
      return res
        .status(404)
        .json({ message: "No posts found for this prompt." });
    }

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate("owner")
      .populate({
        path: "comments",
        populate: { path: "owner", select: "username" },
      });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPost = async (req, res) => {
  const { owner, prompt, text } = req.body;
  try {
    const newPost = new Post({ owner, prompt, text });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    // Going to delete all comments associated with the post.
    await Comment.deleteMany({ postID: req.params.id });

    const deletedPost = await Post.findByIdAndDelete(req.params.postId);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(204).send(); // No content to return
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
