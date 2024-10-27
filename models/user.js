import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: function () {
      return !this.googleId && !this.githubId;
    },
  },
  hashedPassword: {
    type: String,
    required: function () {
      return !this.googleId && !this.githubId;
    },
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  githubId: {
    type: String,
    unique: true,
    sparse: true,
  },
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.hashedPassword;
  },
});

export default mongoose.model("User", userSchema);
