import * as dao from "./dao.js";
import jwt from "jsonwebtoken";
const JWT_SECRET = "platepal";

export default function UserRoutes(app) {

  const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Check if email already exists
        const existingUser = await dao.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }
        // Create a new user
        const newUser = await dao.createUser({ username, email, password });

        // Save user to session or any session store
        req.session.currentUser = {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
        };

        res.status(201).json({ message: "Registration successful", user: newUser });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
  };
  app.post("/api/users/register", register);

  const login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await dao.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
    
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const token = jwt.sign(
        { _id: user._id, name: `${user.firstName} ${user.lastName}` },
        JWT_SECRET, // Replace with your actual secret
        { expiresIn: "1h" }
      );
    
      res.status(200).json({
        token,
        id: user._id,
        name: user.firstName + " " + user.lastName,
        role: user.role,
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  app.post("/api/users/login", login);

  const createUser = async (req, res) => {
    const user = await dao.createUser(req.body);
    res.json(user);
  };
  app.post("/api/users", createUser);

  const deleteUser = async (req, res) => {
    const status = await dao.deleteUser(req.params.userId);
    res.json(status);
  };
  app.delete("/api/users/:userId", deleteUser);

  const findAllUsers = async (req, res) => {
    const { role, name } = req.query;
    if (role) {
      const users = await dao.findUsersByRole(role);
        res.json(users);
        return;
      }
      if (name) {
        const users = await dao.findUsersByPartialName(name);
        res.json(users);
        return;
      }    
      const users = await dao.findAllUsers();
      res.json(users);
    };
    app.get("/api/users", findAllUsers);

    // search for users
    app.get("/api/users/search", async (req, res) => {
      const { username, currentUserId } = req.query; // Expect `currentUserId` in the request
      try {
        const users = await dao.searchUsersWithFollowCounts(username, currentUserId);
        res.json(users);
      } catch (error) {
        console.error("Error searching users:", error.message);
        res.status(500).json({ error: "Failed to search users." });
      }
    });       

    const findUserById = async (req, res) => {
        const user = await dao.findUserById(req.params.userId);
        res.json(user);
    };
    app.get("/api/users/:userId", findUserById);

    const findUsersByPartialUsername = async (req, res) => {
      const { username } = req.query;
      const users = await dao.findUsersByPartialUsername(username);
      res.json(users);
    };
    app.get("/api/users/search", findUsersByPartialUsername);
    
    const updateUser = async (req, res) => {
      const { userId } = req.params;
      const userUpdates = req.body;
      console.log('Received updates:', userUpdates); 
      try {
        // Update the user in the database
        const updateResult = await dao.updateUser(userId, userUpdates);
    
        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ message: 'User not found' });
        }
        // Fetch the updated user profile
        const updatedUser = await dao.findUserById(userId);
  
        // Update the session if the current user is the one being updated
        const currentUser = req.session["currentUser"];
        if (currentUser && currentUser.id === userId) {
          req.session["currentUser"] = { ...currentUser, ...updatedUser };
        }
    
        res.status(200).json(updatedUser); // Return the updated user profile
      } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };
    app.put("/api/users/:userId", updateUser);

    const signup = async (req, res) => {
        const user = await dao.findUserByUsername(req.body.username);
        if (user) {
          res.status(400).json(
            { message: "Username already in use" });
          return;
        }
        const currentUser = await dao.createUser(req.body);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);    
    };
    app.post("/api/users/signup", signup);

    const signin = async (req, res) => {
        const { username, password } = req.body;
        const currentUser = await dao.findUserByCredentials(username, password);
        if (currentUser) {
            req.session["currentUser"] = currentUser;      
            res.json(currentUser);
        } else {
            res.status(401).json({ message: "Unable to login. Try again later." });
        }
    };
    app.post("/api/users/signin", signin);

    const signout = (req, res) => {
        req.session.destroy((err) => {
          if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ message: 'Failed to log out' });
          }
          res.status(200).json({ message: 'Logged out successfully' });
        });
      };
    app.post('/api/users/signout', signout);
      

    const profile = async (req, res) => {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
          res.status(401).json({ message: "Unauthorized: No user logged in" });
          return;
      }
  
      // try {
      //     const user = await dao.findUserById(currentUser.id); // Use the ID stored in the session
      //     if (!user) {
      //         res.status(404).json({ message: "User not found" });
      //         return;
      //     }
      //     res.json(user); // Respond with the user's full profile
        try {
          if (currentUser.role === "Admin") {
            // If the user is an Admin, fetch all users
            const users = await dao.findAllUsers();
            return res.status(200).json({ currentUser, users });
          } else {
            // Otherwise, fetch only the current user's data
            const user = await dao.findUserById(currentUser.id);
            const recipes = await dao.findRecipesByUserId(currentUser.id);
            return res.status(200).json({ currentUser: user, recipes });
          }
      } catch (error) {
          console.error("Error fetching user profile:", error);
          res.status(500).json({ message: "Internal server error" });
      }
  };
  app.get("/api/users/profile", profile); // Change method to GET for fetching user profile
  

}

