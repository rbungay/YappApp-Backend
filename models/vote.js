import mongoose from "mongoose";
const Schema = mongoose.Schema;

const voteSchema = new Schema({
  postID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  upVotes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },

  downVotes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
});

export default mongoose.model("Vote", voteSchema);
