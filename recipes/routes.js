// import * as dao from "./dao.js";
// import upload from "../multer.js";

// export default function RecipeRoutes(app) {

//     const createRecipe = async (req, res) => {
//         const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
//         const recipeData = {
//             ...req.body,
//             image: imagePath,
//           };
//         const recipe = await dao.createRecipe(recipeData);
//         res.json(recipe);
//     };
//     app.post("/api/recipes", upload.single("image"), createRecipe);

//     const deleteRecipe = async (req, res) => {
//         const status = await dao.deleteRecipe(req.params.recipeId);
//         res.json(status);
//     };
//     app.delete("/api/recipes/:recipeId", deleteRecipe);

//     const findAllRecipes = async (req, res) => {
//         const recipes = await dao.findAllRecipes();
//         res.json(recipes);
//     };
//     app.get("/api/recipes", findAllRecipes);

//     const findRecipeById = async (req, res) => {
//         const recipe = await dao.findRecipeById(req.params.recipeId);
//         res.json(recipe);
//     };
//     app.get("/api/recipes/:recipeId", findRecipeById);

//     const findRecipesByPartialTitle = async (req, res) => {
//         const { title } = req.query;
//         const recipes = await dao.findRecipesByPartialTitle(title);
//         res.json(recipes);
//     };
//     app.get("/api/recipes/search", findRecipesByPartialTitle);
    
//     const updateRecipe = async (req, res) => {
//         const { recipeId } = req.params;
//         const recipeUpdates = req.body;
//         await dao.updateRecipe(recipeId, recipeUpdates);
//         const currentRecipe = req.session["currentRecipe"];
//         if (currentRecipe && currentRecipe._id === recipeId) {
//             req.session["currentRecipe"] = { ...currentRecipe, ...recipeUpdates };
//         }
//         res.json(currentRecipe);
//     };
//     app.put("/api/recipes/:recipeId", updateRecipe);
// }

import * as dao from "./dao.js";
import upload from "../multer.js";

export default function RecipeRoutes(app) {
  // Middleware to simulate authenticated user (replace with your actual authentication middleware)
  const authenticate = (req, res, next) => {
    req.user = { _id: "exampleUserId" }; // Replace with logic to fetch logged-in user's ID
    next();
  };

  const createRecipe = async (req, res) => {
    try {
      const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
      const recipeData = {
        ...req.body,
        image: imagePath,
        createdBy: req.user._id, // Use authenticated user's ID
      };
      const recipe = await dao.createRecipe(recipeData);
      res.status(201).json(recipe);
    } catch (error) {
      console.error("Error creating recipe:", error.message);
      res.status(400).json({ error: error.message });
    }
  };
  app.post("/api/recipes", authenticate, upload.single("image"), createRecipe);

  const deleteRecipe = async (req, res) => {
    try {
      const status = await dao.deleteRecipe(req.params.recipeId);
      res.json(status);
    } catch (error) {
      console.error("Error deleting recipe:", error.message);
      res.status(400).json({ error: error.message });
    }
  };
  app.delete("/api/recipes/:recipeId", deleteRecipe);

  const findAllRecipes = async (req, res) => {
    try {
      const { tags, cuisine } = req.query;
      const filters = {};
      if (tags) filters.tags = tags;
      if (cuisine) filters.cuisine = cuisine;
      
      const recipes = await dao.findAllRecipes();
      res.json(recipes);
    } catch (error) {
      console.error("Error fetching recipes:", error.message);
      res.status(400).json({ error: error.message });
    }
  };
  app.get("/api/recipes", findAllRecipes);

  const findRecipeById = async (req, res) => {
    try {
      const recipe = await dao.findRecipeById(req.params.recipeId);
      res.json(recipe);
    } catch (error) {
      console.error("Error fetching recipe:", error.message);
      res.status(400).json({ error: error.message });
    }
  };
  app.get("/api/recipes/:recipeId", findRecipeById);

  const updateRecipe = async (req, res) => {
    try {
      const { recipeId } = req.params;
      const recipeUpdates = req.body;
      const updatedRecipe = await dao.updateRecipe(recipeId, recipeUpdates);
      res.json(updatedRecipe);
    } catch (error) {
      console.error("Error updating recipe:", error.message);
      res.status(400).json({ error: error.message });
    }
  };
  app.put("/api/recipes/:recipeId", authenticate, updateRecipe);
}
