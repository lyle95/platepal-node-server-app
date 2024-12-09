import * as dao from "./dao.js";

export default function LikeRoutes(app) {
    const addLike = async (req, res) => {
        const { userId, recipeId } = req.body;
        try {
            const like = await dao.addLike(userId, recipeId);
            res.json(like);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    app.post("/api/likes", addLike);

    const removeLike = async (req, res) => {
        const { userId, recipeId } = req.body;
        try {
            const result = await dao.removeLike(userId, recipeId);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    app.delete("/api/likes", removeLike);

    const hasLikedRecipe = async (req, res) => {
        const { userId, recipeId } = req.query;
        try {
            const hasLiked = await dao.hasLikedRecipe(userId, recipeId);
            res.json({ hasLiked });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    app.get("/api/likes/status", hasLikedRecipe);

    const countLikesByRecipe = async (req, res) => {
        const { recipeId } = req.params;
        try {
            const count = await dao.countLikesByRecipe(recipeId);
            res.json({ count });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    app.get("/api/likes/recipe/:recipeId", countLikesByRecipe);

    const findLikedRecipesByUser = async (req, res) => {
        const { userId } = req.params;
        try {
            const recipes = await dao.findLikedRecipesByUser(userId);
            res.json(recipes);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    app.get("/api/likes/user/:userId", findLikedRecipesByUser);
}