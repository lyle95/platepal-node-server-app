import model from "./model.js";
import RecipeModel from "../recipes/model.js";

export const addLike = async (userId, recipeId) => {
    try {
        const existingLike = await model.findOne({ user: userId, recipe: recipeId });
        if (existingLike) throw new Error("User already liked this recipe.");

        return await model.create({ user: userId, recipe: recipeId });
    } catch (error) {
        throw new Error(`Error adding like: ${error.message}`);
    }
};

export const removeLike = async (userId, recipeId) => {
    try {
        return await model.deleteOne({ user: userId, recipe: recipeId });
    } catch (error) {
        throw new Error(`Error removing like: ${error.message}`);
    }
};

export const hasLikedRecipe = async (userId, recipeId) => {
    try {
        const like = await model.findOne({ user: userId, recipe: recipeId });
        return !!like; // Return true if the user has liked the recipe, false otherwise
    } catch (error) {
        throw new Error(`Error checking like status: ${error.message}`);
    }
};

export const countLikesByRecipe = async (recipeId) => {
    try {
        return await model.countDocuments({ recipe: recipeId });
    } catch (error) {
        throw new Error(`Error counting likes: ${error.message}`);
    }
};

export const findFavoriteRecipesByUser = async (userId) => {
  try {
    const favorites = await model
      .find({ user: userId })
      .populate("recipe", "title description tags image cuisine");
    return favorites.map((like) => like.recipe);
  } catch (error) {
    throw new Error(`Error finding favorite recipes: ${error.message}`);
  }
};

