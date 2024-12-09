import model from "./model.js";

export const addLike = async (userId, recipeId) => {
    try {
        const existingLike = await model.findOne({ userId, recipeId });
        if (existingLike) throw new Error("User already liked this recipe.");

        return await model.create({ userId, recipeId });
    } catch (error) {
        throw new Error(`Error adding like: ${error.message}`);
    }
};

export const removeLike = async (userId, recipeId) => {
    try {
        return await model.deleteOne({ userId, recipeId });
    } catch (error) {
        throw new Error(`Error removing like: ${error.message}`);
    }
};

export const hasLikedRecipe = async (userId, recipeId) => {
    try {
        const like = await model.findOne({ userId, recipeId });
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

export const findLikedRecipesByUser = async (userId) => {
    try {
        return await model.find({ user: userId }).populate("recipe", "title description");
    } catch (error) {
        throw new Error(`Error finding liked recipes: ${error.message}`);
    }
};
