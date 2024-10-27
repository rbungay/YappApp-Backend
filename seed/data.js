import db from "../db/connection.js";
import User from "../models/user.js";
import Post from "../models/post.js";
import Prompt from "../models/prompt.js";
import Vote from "../models/vote.js";
import Comment from "../models/comment.js";

const insertData = async () => {
  // Drop the database
  await db.dropDatabase();

  // Create Users and store them in a variable
  const users = await User.create(
    Array.from({ length: 10 }, (_, i) => ({
      username: `user${i}`,
      hashedPassword: `password${i}`,
    }))
  );
  console.log("Users have been created.");

  // Create Creative Prompts with unique dates
  const prompts = await Prompt.create(
    [
      {
        prompt: "What would you do if you could time travel?",
        category: "Creative Writing",
      },
      {
        prompt: "Describe your ideal day in vivid detail.",
        category: "Personal Reflection",
      },
      {
        prompt:
          "If you could have dinner with any historical figure, who would it be?",
        category: "Historical Inquiry",
      },
      {
        prompt:
          "Write a story that begins with 'It was a dark and stormy night...'",
        category: "Fiction",
      },
      {
        prompt: "What is a dream you've had that has stuck with you?",
        category: "Dream Analysis",
      },
    ].map((item, index) => ({
      ...item,
      date: new Date(Date.now() + index * 86400000), // Unique dates
    }))
  );
  console.log("Prompts have been created.");

  // Create Creative Posts for each Prompt
  const createdPosts = [];
  for (const prompt of prompts) {
    const posts = await Post.create(
      Array.from({ length: 10 }, (_, j) => ({
        owner: users[Math.floor(Math.random() * users.length)]._id,
        prompt: prompt._id,
        text: `Post text ${j} for prompt: "${prompt.prompt}". Dive deep into your imagination!`,
      }))
    );
    createdPosts.push(...posts);
    console.log(`Posts for prompt "${prompt.prompt}" have been created.`);
  }

  // Create Comments for each Post
  for (const post of createdPosts) {
    const comments = await Comment.create(
      Array.from({ length: 10 }, (_, k) => ({
        owner: users[Math.floor(Math.random() * users.length)]._id,
        post: post._id,
        text: `Comment text ${k} for post: "${post.text}"`,
      }))
    );
    console.log(`Comments for post: "${post.text}" have been created.`);
  }

  // Create Votes for each Post
  for (const post of createdPosts) {
    const votes = {
      postID: post._id,
      upVotes: [],
      downVotes: [],
    };
    for (let m = 0; m < 5; m++) {
      votes.upVotes.push(users[Math.floor(Math.random() * users.length)]._id);
      votes.downVotes.push(users[Math.floor(Math.random() * users.length)]._id);
    }
    await Vote.create(votes);
    console.log(`Votes for post "${post.text}" have been created.`);
  }

  // Close the database connection
  await db.close();
};

insertData().catch((error) => {
  console.error("Error inserting data:", error);
});
