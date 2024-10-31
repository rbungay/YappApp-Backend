import Prompt from "../models/prompt.js";
// import Post from "../models/post.js";

export const getPrompts = async (req, res) => {
  try {
    const prompts = await Prompt.find({});
    res.json(prompts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPrompt = async (req, res) => {
  try {
    const newPrompt = new Prompt(req.body);
    await newPrompt.save();
    res.status(201).json(newPrompt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTodayPrompt = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Start of tomorrow

    // Find prompts where the date is today
    const prompt = await Prompt.findOne({
      date: { $gte: today, $lt: tomorrow },
    });

    if (!prompt) {
      return res.status(404).json({ message: "No prompt for today" });
    }

    res.json(prompt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPreviousPrompts = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0); // Start of today

    // Find prompts where the date is less than today
    const previousPrompts = await Prompt.find({ date: { $lt: today } });

    if (previousPrompts.length === 0) {
      return res.status(404).json({ message: "No previous prompts found" });
    }

    res.json(previousPrompts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
