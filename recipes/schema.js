import mongoose from "mongoose";

const recipesSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, 
    description: { type: String },
    ingredients: { type: [String], required: true }, 
    steps: { type: [String], required: true }, 
    cuisine: { type: String }, 
    tags: { type: [String] },
    cookTime: { type: Number }, 
    prepTime: { type: Number }, 
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "UserModel", 
      required: true 
    }, 
    createdAt: { type: Date, default: Date.now }, 
    image: { type: String },
  },
  { collection: "recipes" }
);

export default recipesSchema;
