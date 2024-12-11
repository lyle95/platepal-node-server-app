import model from "./model.js";
// import User from "../users/model.js";
import mongoose from "mongoose";

// Create a new recipe
export const createRecipe = async (recipe) => {
    try {
        return await model.create(recipe);
    } catch (error) {
        throw new Error(`Error creating recipe: ${error.message}`);
    }
};

// Find all recipes
export const findAllRecipes = async (filters = {}) => {
  try {
    return await model.find(filters).populate("createdBy", "username");
  } catch (error) {
    throw new Error(`Error finding recipes: ${error.message}`);
  }
};

// Find a recipe by ID
export const findRecipeById = async (recipeId) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(recipeId)) {
        throw new Error('Invalid ObjectId');
      }
      return await model.findById(recipeId).populate("createdBy", "username");
    } catch (error) {
      throw new Error(`Error finding recipe by ID: ${error.message}`);
    }
};

// Find recipes by partial title
export const findRecipesByPartialTitle = async (partialTitle) => {
    try {
        const regex = new RegExp(partialTitle, "i"); // Case-insensitive regex
        return await model.find({
           title: { $regex: regex } 
        });
    } catch (error) {
        throw new Error(`Error finding recipes by partial title: ${error.message}`);
    }
};

// Find recipes by user id
export const findRecipesByUserId = async (userId) => {
  try {
    return await model.find({ createdBy: userId }).populate("createdBy", "username");
  } catch (error) {
    throw new Error(`Error finding recipes by user ID: ${error.message}`);
  }
};

// Update a recipe
// export const updateRecipe = async (recipeId, recipe) => {
//   try {
//     return await model.updateOne({ _id: recipeId }, { $set: recipe });
//   } catch (error) {
//     throw new Error(`Error updating recipe: ${error.message}`);
//   }
// };
export const updateRecipe = async (recipeId, recipeUpdates) => {
  try {
    return await model.findByIdAndUpdate(recipeId, { $set: recipeUpdates }, { new: true });
  } catch (error) {
    throw new Error(`Error updating recipe: ${error.message}`);
  }
};


// Delete a recipe
export const deleteRecipe = async (recipeId) => {
  try {
    return await model.deleteOne({ _id: recipeId });
  } catch (error) {
    throw new Error(`Error deleting recipe: ${error.message}`);
  }
};

export const getDistinctTags = async () => {
  try {
    return await model.distinct("tags");
  } catch (error) {
    throw new Error(`Error fetching distinct tags: ${error.message}`);
  }
};

export const getDistinctCategories = async () => {
  try {
    return await model.distinct("cuisine");
  } catch (error) {
    throw new Error(`Error fetching distinct categories: ${error.message}`);
  }
};
  

