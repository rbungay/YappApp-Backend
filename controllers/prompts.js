import Prompt from "../models/prompt.js";
// import Post from "../models/post.js";

export const getPrompts = async (req, res) => {
    try {
        const prompts = await Prompt.find({})
        res.json(prompts)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const createPrompt = async (req, res) => {
    try {
        const newPrompt = new Prompt(req.body)
        await newPrompt.save();
        res.status(201).json(newPrompt);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}