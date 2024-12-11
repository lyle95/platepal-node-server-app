import model from "./model.js";

// add comment
export const addComment = async (userId, recipeId, text) => {
  try {
    const comment = await model.create({ text, commentedBy: userId, recipe: recipeId});
    return await model.findById(comment._id).populate("commentedBy", "username");
  } catch (error) {
    throw new Error(`Error adding comment: ${error.message}`);
  }
};

// get comments by recipe
export const getCommentsByRecipe = async (recipeId) => {
  try {
    return await model.find({ recipe: recipeId }).populate("commentedBy", "username");
  } catch (error) {
    throw new Error(`Error getting comments for recipe: ${error.message}`);
  }
};

// update comment
export const updateComment = async (commentId, userId, text) => {
  try {
    const comment = await model.findById(commentId);
    if (!comment) throw new Error("Comment not found");

    // Only the commenter can edit the comment
    if (comment.commentedBy.toString() !== userId) {
      throw new Error("Unauthorized to edit this comment");
    }

    comment.text = text;
    await comment.save();
    return comment;
  } catch (error) {
    throw new Error(`Error updating comment: ${error.message}`);
  }
};

// delete comment
export const deleteComment = async (commentId, userId, role) => {
  try {
    const comment = await model.findById(commentId);
    if (!comment) throw new Error("Comment not found");

    // Only the commenter or an Admin can delete the comment
    if (comment.commentedBy.toString() !== userId && role !== "Admin") {
      throw new Error("Unauthorized to delete this comment");
    }

    return await model.deleteOne({ _id: commentId });
  } catch (error) {
    throw new Error(`Error deleting comment: ${error.message}`);
  }
};