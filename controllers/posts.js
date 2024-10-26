import Post from "../models/post.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({});
    if (!posts) {
      res.status(404);
      throw new Error("No posts at the moment");
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
