import mongoose from "mongoose";
const Schema = mongoose.Schema;

const promptSchema = new Schema({
  date: {
    type: Date,
    unique: true, // Ensures only one prompt per date
    default: Date.now, // Sets the date to current date by default
  },
  prompt: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  isHot: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Prompt", promptSchema);
