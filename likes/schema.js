import mongoose from "mongoose";

const likesSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true },
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: "RecipeModel", required: true },
    likedAt: { type: Date, default: Date.now },
  },
  { collection: "likes" }
);
likesSchema.index({ user: 1, recipe: 1}, { unique: true });
export default likesSchema;
