import mongoose from "mongoose";

const commentsSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, minlength: 1, maxlength: 500 },
    commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true },
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: "RecipeModel", required: true },
    commentedAt: { type: Date, default: Date.now },
  },
  { collection: "comments" }
);

export default commentsSchema;