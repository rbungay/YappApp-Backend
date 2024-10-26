import mongoose from "mongoose";
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    prompt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prompt",
      required: true,
    },
    text: {
      type: String,
      req: true,
    },
    countUp: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Vote",
    },
    countDown: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Vote",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
