import mongoose from "mongoose";

const followsSchema = new mongoose.Schema(
  {
    follower: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true },
    following: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true },
    followedAt: { type: Date, default: Date.now },
  },
  { collection: "follows" }
);
followsSchema.index({ follower: 1, following: 1}, { unique: true });
export default followsSchema;
