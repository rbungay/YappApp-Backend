import db from "../db/connection.js";
import User from "../models/user.js";
import Post from "../models/post.js";
import Prompt from "../models/prompt.js";
import Vote from "../models/vote.js";
import Comment from "../models/comment.js";

const insertData = async () => {
  // Drop the database
  await db.dropDatabase();
  console.log("Database has been dropped.");

  // Create Users
  const users = await User.create([
    { username: "Alice Wonderland", hashedPassword: "password123" },
    { username: "Bob Builder", hashedPassword: "password234" },
    { username: "Charlie Brown", hashedPassword: "password345" },
    { username: "Daisy Duke", hashedPassword: "password456" },
    { username: "Ethan Hunt", hashedPassword: "password567" },
    { username: "Fiona Apple", hashedPassword: "password678" },
    { username: "George Costanza", hashedPassword: "password789" },
    { username: "Hannah Montana", hashedPassword: "password890" },
    { username: "Ivy League", hashedPassword: "password901" },
    { username: "Jack Sparrow", hashedPassword: "password012" },
  ]);
  console.log("Users have been created.");

  // Create Prompts from the past 10 days
  const promptsData = [
    {
      prompt:
        "If you could rewrite the ending of any book, which would it be and why?",
      category: "Literature",
    },
    {
      prompt: "What’s a skill you’ve always wanted to learn and why?",
      category: "Self-Improvement",
    },
    {
      prompt: "Describe a day where you’d do absolutely nothing.",
      category: "Lifestyle",
    },
    {
      prompt: "What’s the most important lesson you’ve learned this year?",
      category: "Reflection",
    },
    {
      prompt: "If you could live in any fictional universe, where would it be?",
      category: "Imagination",
    },
    {
      prompt: "Who is someone who inspires you and why?",
      category: "Motivation",
    },
    {
      prompt: "What’s a memory you hope to never forget?",
      category: "Personal Reflection",
    },
    {
      prompt:
        "If you could have dinner with any historical figure, who would it be?",
      category: "History",
    },
    {
      prompt: "Describe your ideal future self in one paragraph.",
      category: "Goals",
    },
    {
      prompt: "What’s a habit you’d like to break?",
      category: "Self-Improvement",
    },
  ];

  const prompts = await Prompt.create(
    promptsData.map((item, index) => ({
      ...item,
      date: new Date(Date.now() - index * 86400000), // Unique dates for the past 10 days
    }))
  );
  console.log("Prompts have been created.");

  // Create Posts with thoughtful responses for each Prompt
  const createdPosts = [];
  for (const prompt of prompts) {
    const posts = await Post.create(
      Array.from({ length: 10 }, (_, j) => {
        let response;
        switch (prompt.prompt) {
          case "If you could rewrite the ending of any book, which would it be and why?":
            response =
              "I'd change the ending of *The Great Gatsby* to give Gatsby a real chance at happiness. His life was filled with regret and unrequited love, and it felt tragic without closure.";
            break;
          case "What’s a skill you’ve always wanted to learn and why?":
            response =
              "I've always wanted to learn how to play the piano. Music has a way of expressing emotions that words can’t, and it would be incredible to create my own melodies.";
            break;
          case "Describe a day where you’d do absolutely nothing.":
            response =
              "It would be a day filled with cozy blankets, warm drinks, and maybe a favorite book. Just letting myself unwind without any pressure to be productive.";
            break;
          case "What’s the most important lesson you’ve learned this year?":
            response =
              "This year taught me that patience is key. Sometimes things don’t happen on our timeline, but that doesn’t mean they won’t happen.";
            break;
          case "If you could live in any fictional universe, where would it be?":
            response =
              "I would live in the world of Harry Potter. Experiencing Hogwarts and the magic would be beyond amazing!";
            break;
          case "Who is someone who inspires you and why?":
            response =
              "My grandmother inspires me. She has always shown resilience and grace in the face of hardships, and she reminds me to stay positive no matter what.";
            break;
          case "What’s a memory you hope to never forget?":
            response =
              "One memory I treasure is the first family vacation we took to the mountains. We laughed around the campfire, told stories, and it was one of the happiest times in my life.";
            break;
          case "If you could have dinner with any historical figure, who would it be?":
            response =
              "I'd choose Leonardo da Vinci. His curiosity and creativity were unmatched, and I'd love to know how he saw the world.";
            break;
          case "Describe your ideal future self in one paragraph.":
            response =
              "My ideal future self is compassionate, driven, and at peace. I hope to be someone who inspires others and feels content in both personal and professional life.";
            break;
          case "What’s a habit you’d like to break?":
            response =
              "I'd love to stop procrastinating. It often holds me back from achieving my goals, and overcoming it would make a big difference in my life.";
            break;
          default:
            response = "This is a post related to a prompt.";
        }
        return {
          owner: users[Math.floor(Math.random() * users.length)]._id,
          prompt: prompt._id,
          text: response,
        };
      })
    );
    createdPosts.push(...posts);
    console.log(`Posts for prompt "${prompt.prompt}" have been created.`);
  }

  // Create Comments for each Post
  for (const post of createdPosts) {
    const comments = await Comment.create(
      Array.from({ length: 10 }, (_, k) => {
        let commentText;
        switch (post.text) {
          case "I'd change the ending of *The Great Gatsby* to give Gatsby a real chance at happiness.":
            commentText =
              "That’s such a thoughtful change. It really was a heartbreaking ending.";
            break;
          case "I've always wanted to learn how to play the piano.":
            commentText =
              "Music is so freeing! I hope you get the chance to learn.";
            break;
          case "It would be a day filled with cozy blankets, warm drinks, and maybe a favorite book.":
            commentText =
              "Sounds like the perfect day! We all need time to recharge.";
            break;
          case "This year taught me that patience is key.":
            commentText =
              "So true. It’s hard to wait, but it’s worth it in the end.";
            break;
          case "I would live in the world of Harry Potter.":
            commentText = "Who wouldn’t want to go to Hogwarts? Great choice!";
            break;
          case "My grandmother inspires me.":
            commentText =
              "Grandparents are often the best role models. She sounds amazing!";
            break;
          case "One memory I treasure is the first family vacation we took to the mountains.":
            commentText =
              "That sounds beautiful. Family moments like that are priceless.";
            break;
          case "I'd choose Leonardo da Vinci.":
            commentText =
              "Da Vinci would have been an incredible dinner guest. Imagine the stories he’d tell!";
            break;
          case "My ideal future self is compassionate, driven, and at peace.":
            commentText =
              "That’s inspiring! Wishing you the best in your journey toward that future.";
            break;
          case "I'd love to stop procrastinating.":
            commentText =
              "Relatable! Breaking that habit would be a huge accomplishment.";
            break;
          default:
            commentText = "Interesting perspective! I’d love to know more.";
        }
        return {
          owner: users[Math.floor(Math.random() * users.length)]._id,
          postId: post._id,
          text: commentText,
        };
      })
    );
    console.log(`Comments for post: "${post.text}" have been created.`);
  }

  // Create Votes for each Post
  for (const post of createdPosts) {
    const upVotes = Array.from({ length: 5 }, () => ({
      user: users[Math.floor(Math.random() * users.length)]._id,
      post: post._id,
      type: "upvote",
    }));

    const downVotes = Array.from({ length: 5 }, () => ({
      user: users[Math.floor(Math.random() * users.length)]._id,
      post: post._id,
      type: "downvote",
    }));

    await Vote.create([...upVotes, ...downVotes]);
    console.log(`Votes for post "${post.text}" have been created.`);
  }

  // Close the database connection
  await db.close();
};

insertData().catch((error) => {
  console.error("Error inserting data:", error);
});
