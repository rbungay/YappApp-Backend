import Post from "../models/post.js";
import Comment from "../models/comment.js";
import Vote from "../models/vote.js";

// export const getPosts = async (req, res) => {
//   try {
//     const posts = await Post.find({})
//       .populate("owner")
//       .populate("prompt")
//       // .populate("countUp")
//       // .populate("countDown")
//       .populate({
//         path: "comments",
//         populate: { path: "owner", select: "username" },
//       });

//     if (!posts.length) {
//       return res.status(404).json({ message: "No posts at the moment" });
//     }

//     res.status(200).json(posts);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("owner")
      .populate("prompt")
      .populate({
        path: "comments",
        populate: { path: "owner", select: "username" },
      });

    if (!posts.length) {
      return res.status(404).json({ message: "No posts at the moment" });
    }

    // Fetch vote counts for each post
    const postsWithVotes = await Promise.all(
      posts.map(async (post) => {
        const results = await Vote.aggregate([
          { $match: { post: post._id } },
          {
            $group: {
              _id: "$type",
              count: { $sum: 1 },
            },
          },
        ]);

        const voteCounts = { upvotes: 0, downvotes: 0 };
        results.forEach((result) => {
          if (result._id === "upvote") {
            voteCounts.upvotes = result.count;
          } else if (result._id === "downvote") {
            voteCounts.downvotes = result.count;
          }
        });

        return {
          ...post.toObject(),
          voteCounts,
        };
      })
    );

    res.status(200).json(postsWithVotes);
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

    // Fetch vote counts for the specific post
    const results = await Vote.aggregate([
      { $match: { post: post._id } },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);

    const voteCounts = { upvotes: 0, downvotes: 0 };
    results.forEach((result) => {
      if (result._id === "upvote") {
        voteCounts.upvotes = result.count;
      } else if (result._id === "downvote") {
        voteCounts.downvotes = result.count;
      }
    });

    res.status(200).json({
      ...post.toObject(),
      voteCounts,
    });
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

export const castVote = async (req, res) => {
  const { voteType } = req.body;
  const { _id: userId } = req.user;
  const { postId } = req.params;

  try {
    let vote = await Vote.findOne({ post: postId, user: userId });

    if (vote) {
      // Update existing vote
      vote.type = voteType;
    } else {
      // Create new vote
      vote = new Vote({ user: userId, post: postId, type: voteType });
    }

    await vote.save();
    res.status(200).json({ message: "Vote registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error processing vote" });
  }
};

export const getVote = async (req, res) => {
  const { postId } = req.params;
  const { _id: userId } = req.user;

  try {
    let vote = await Vote.findOne({ post: postId, user: userId });
    res.status(200).json(vote);
  } catch (error) {
    res.status(500).json({ message: "Error accessing vote" });
  }
};
