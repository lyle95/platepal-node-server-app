import model from "./model.js";
import User from "../users/model.js";

// Create a new recipe
export const createRecipe = async (recipe) => {
    try {
        return await model.create(recipe);
    } catch (error) {
        throw new Error(`Error creating recipe: ${error.message}`);
    }
};

// Find all recipes
export const findAllRecipes = async () => {
    try {
        return await model.find().populate("createdBy", "username");
    } catch (error) {
        throw new Error(`Error finding recipes: ${error.message}`);
    }
};

// Find a recipe by ID
export const findRecipeById = async (recipeId) => {
    try {
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

// Update a recipe
export const updateRecipe = async (recipeId, recipe) => {
  try {
    return await model.updateOne({ _id: recipeId }, { $set: recipe });
  } catch (error) {
    throw new Error(`Error updating recipe: ${error.message}`);
  }
};

// Delete a recipe
export const deleteRecipe = async (recipeId) => {
  try {
    return await model.deleteOne(recipeId);
  } catch (error) {
    throw new Error(`Error deleting recipe: ${error.message}`);
  }
};

// Find recipes by tag
export const findRecipesByTag = async (tag) => {
  try {
    return await model.find({ tags: tag });
  } catch (error) {
    throw new Error(`Error finding recipes by tag: ${error.message}`);
  }
};

// Find recipes by cuisine
export const findRecipesByCuisine = async (cuisine) => {
  try {
    return await model.find({ cuisine });
  } catch (error) {
    throw new Error(`Error finding recipes by cuisine: ${error.message}`);
  }
};
  

