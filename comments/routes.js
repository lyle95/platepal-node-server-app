import * as dao from "./dao.js";

export default function CommentRoutes(app) {
    const updateComment = async (req, res) => {
        const { commentId } = req.params;
        const { userId, text } = req.body;
    
        try {
          const updatedComment = await dao.updateComment(commentId, userId, text);
          res.json(updatedComment);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
    };
    
    app.put("/api/comments/:commentId", updateComment);
      
    const addComment = async (req, res) => {
        const { userId, recipeId, text, role } = req.body;
        if (role !== "Cook" && role !== "Admin") {
            res.status(403).json({ message: "Only Cooks or Admins can leave comments." });
            return;
        }
        try {
            const comment = await dao.addComment(userId, recipeId, text);
            res.json(comment);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    app.post("/api/comments", addComment);

    const getCommentsByRecipe = async (req, res) => {
        const { recipeId } = req.params;
        try {
            const comments = await dao.getCommentsByRecipe(recipeId);
            res.json(comments);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    app.get("/api/comments/recipe/:recipeId", getCommentsByRecipe);

    const deleteComment = async (req, res) => {
        const { commentId } = req.params;
        const { userId, role } = req.body;
        try {
            const result = await dao.deleteComment(commentId, userId, role);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    app.delete("/api/comments/:commentId", deleteComment);
}
