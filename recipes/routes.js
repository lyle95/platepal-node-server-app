import * as dao from "./dao.js";
import upload from "../multer.js";
import mongoose from "mongoose";
import authenticate from '../middleware/authenticate.js';

export default function RecipeRoutes(app) {

  // const createRecipe = async (req, res) => {
  //     try {
  //         const { title, ingredients, steps } = req.body;

  //         // Ensure required fields are present
  //         if (!title || !ingredients || !steps) {
  //             return res.status(400).json({ message: "Title, ingredients, and steps are required." });
  //         }

  //         // Safely parse JSON fields
  //         let parsedIngredients, parsedSteps, parsedTags;
  //         try {
  //             parsedIngredients = typeof ingredients === "string" ? JSON.parse(ingredients) : ingredients;
  //             parsedSteps = typeof steps === "string" ? JSON.parse(steps) : steps;
  //             parsedTags = req.body.tags ? JSON.parse(req.body.tags) : [];
  //         } catch (error) {
  //             return res.status(400).json({ message: "Invalid JSON format in ingredients, steps, or tags." });
  //         }

  //         // Validate ingredients and steps
  //         if (!Array.isArray(parsedIngredients) || !parsedIngredients.length) {
  //             return res.status(400).json({ message: "At least one valid ingredient is required." });
  //         }

  //         if (!Array.isArray(parsedSteps) || !parsedSteps.length) {
  //             return res.status(400).json({ message: "At least one valid step is required." });
  //         }

  //         const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  //         // Properly instantiate the `ObjectId`
  //         const createdBy = new mongoose.Types.ObjectId(req.user._id);

  //         // Validate or create ObjectId for createdBy
  //         if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
  //           return res.status(400).json({ message: "Invalid user ID format." });
  //       }
  //         // Prepare recipe data
  //         const recipeData = {
  //             title,
  //             ingredients: parsedIngredients,
  //             steps: parsedSteps,
  //             description: req.body.description || "",
  //             tags: parsedTags,
  //             cuisine: req.body.cuisine || "",
  //             cookTime: Number(req.body.cookTime) || 0,
  //             prepTime: Number(req.body.prepTime) || 0,
  //             image: imagePath,
  //             createdBy, // Cast createdBy to ObjectId
  //         };

  //         // Log data for debugging
  //         console.log("Recipe data being saved:", recipeData);

  //         const recipe = await dao.createRecipe(recipeData);
  //         res.status(201).json(recipe);
  //     } catch (error) {
  //         console.error("Error creating recipe:", error.message);
  //         res.status(400).json({ error: error.message });
  //     }
  // };
  // app.post("/api/recipes", authenticate, upload.single("image"), createRecipe);
  const createRecipe = async (req, res) => {
    try {
      const { title, ingredients, steps } = req.body;
  
      // Ensure required fields are present
      if (!title || !ingredients || !steps) {
        return res.status(400).json({ message: "Title, ingredients, and steps are required." });
      }
  
      // Safely parse JSON fields
      let parsedIngredients, parsedSteps, parsedTags;
      try {
        parsedIngredients = typeof ingredients === "string" ? JSON.parse(ingredients) : ingredients;
        parsedSteps = typeof steps === "string" ? JSON.parse(steps) : steps;
        parsedTags = req.body.tags ? JSON.parse(req.body.tags) : [];
      } catch (error) {
        return res.status(400).json({ message: "Invalid JSON format in ingredients, steps, or tags." });
      }
  
      // Validate ingredients and steps
      if (!Array.isArray(parsedIngredients) || !parsedIngredients.length) {
        return res.status(400).json({ message: "At least one valid ingredient is required." });
      }
      if (!Array.isArray(parsedSteps) || !parsedSteps.length) {
        return res.status(400).json({ message: "At least one valid step is required." });
      }
  
      // Validate and log the uploaded file
      const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
      console.log("Uploaded file path:", imagePath);
  
      // Validate or create `ObjectId` for `createdBy`
      if (!req.user || !mongoose.Types.ObjectId.isValid(req.user._id)) {
        return res.status(400).json({ message: "Invalid or missing user ID." });
      }
      const createdBy = new mongoose.Types.ObjectId(req.user._id);
  
      // Prepare recipe data
      const recipeData = {
        title,
        ingredients: parsedIngredients,
        steps: parsedSteps,
        description: req.body.description || "",
        tags: parsedTags,
        cuisine: req.body.cuisine || "",
        cookTime: Number(req.body.cookTime) || 0,
        prepTime: Number(req.body.prepTime) || 0,
        image: imagePath, // Use the validated file path
        createdBy, // Cast createdBy to ObjectId
      };
  
      console.log("Recipe data being saved:", recipeData);
  
      // Save the recipe
      const recipe = await dao.createRecipe(recipeData);
      res.status(201).json(recipe);
    } catch (error) {
      console.error("Error creating recipe:", error.message);
      res.status(400).json({ error: error.message });
    }
  };
  
  // Route for creating a recipe
  app.post("/api/recipes", authenticate, upload.single("image"), createRecipe);
  


  const deleteRecipe = async (req, res) => {
    const { recipeId } = req.params;
  
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return res.status(400).json({ error: 'Invalid recipe ID format' });
    }
  
    try {
      const status = await dao.deleteRecipe(recipeId);
      if (status.deletedCount === 0) {
        return res.status(404).json({ error: 'Recipe not found' });
      }
      res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
      console.error("Error deleting recipe:", error.message);
      res.status(500).json({ error: 'Failed to delete recipe' });
    }
  };
  
  app.delete("/api/recipes/:recipeId", authenticate, deleteRecipe);



  const findAllRecipes = async (req, res) => {
    try {
      const recipes = await dao.findAllRecipes();
      console.log("Recipes returned by API:", recipes);
      res.status(200).json(recipes);
      
    } catch (error) {
      console.error("Error fetching recipes:", error.message);
      res.status(400).json({ error: error.message });
    }
  };
  app.get("/api/recipes", findAllRecipes);



  const searchRecipes = async (req, res) => {
    const { query, tag, category } = req.query;
  
    try {
      const filters = {};
      if (query) filters.title = { $regex: query, $options: 'i' }; 
      if (tag) filters.tags = tag; 
      if (category) filters.cuisine = category; 
  
      const recipes = await dao.findAllRecipes(filters); 
      res.status(200).json(recipes);
    } catch (error) {
      console.error('Error searching recipes:', error.message);
      res.status(500).json({ error: 'Failed to search recipes.' });
    }
  };  
  app.get('/api/recipes/search', searchRecipes);



  const getDistinctTags = async (req, res) => {
    try {
      const tags = await dao.getDistinctTags();
      res.status(200).json(tags);
    } catch (error) {
      console.error("Error fetching tags:", error.message);
      res.status(500).json({ error: "Failed to fetch tags." });
    }
  };
  app.get("/api/recipes/tags", getDistinctTags);
  


  const getDistinctCategories = async (req, res) => {
    try {
      const categories = await dao.getDistinctCategories();
      res.status(200).json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
      res.status(500).json({ error: "Failed to fetch categories." });
    }
  };
  app.get("/api/recipes/categories", getDistinctCategories);
  


  const findRecipeById = async (req, res) => {
    const { recipeId } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return res.status(400).json({ error: 'Invalid recipe ID format' });
    }
  
    try {
      const recipe = await dao.findRecipeById(recipeId);
      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }
      res.json(recipe);
    } catch (error) {
      console.error('Error fetching recipe:', error.message);
      res.status(500).json({ error: 'Failed to fetch recipe' });
    }
  };

  app.get("/api/recipes/:recipeId", findRecipeById);
  


  const findRecipesByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
      const recipes = await dao.findRecipesByUserId(userId);
      res.json(recipes);
    } catch (error) {
      console.error("Error fetching recipes by user ID:", error.message);
      res.status(500).json({ error: "Failed to fetch user recipes." });
    }
  };
  app.get("/api/recipes/user/:userId", findRecipesByUserId);
  


  const updateRecipe = async (req, res) => {
    const { recipeId } = req.params;
  
    // Validate recipeId
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return res.status(400).json({ error: 'Invalid recipe ID format' });
    }
  
    try {
      // Parse form data fields
      const updatedFields = {
        title: req.body.title,
        description: req.body.description || '',
        cuisine: req.body.cuisine || '',
        cookTime: Number(req.body.cookTime) || 0,
        prepTime: Number(req.body.prepTime) || 0,
        ingredients: req.body.ingredients ? JSON.parse(req.body.ingredients) : [],
        steps: req.body.steps ? JSON.parse(req.body.steps) : [],
        tags: req.body.tags ? JSON.parse(req.body.tags) : [],
      };
  
      if (req.file) {
        updatedFields.image = `/uploads/${req.file.filename}`;
      }
  
      const updatedRecipe = await dao.updateRecipe(recipeId, updatedFields);
  
      if (!updatedRecipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }
  
      res.json(updatedRecipe);
    } catch (error) {
      console.error('Error updating recipe:', error.message);
      res.status(500).json({ error: 'Failed to update recipe' });
    }
  };
  
  app.put('/api/recipes/:recipeId', authenticate, upload.single('image'), updateRecipe);

}
