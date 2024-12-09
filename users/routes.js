import * as dao from "./dao.js";

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
        const newUser = await dao.createUser({ username, email, password, role: "Cook" });

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
    
          res.status(200).json({
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
        await dao.updateUser(userId, userUpdates);
        const currentUser = req.session["currentUser"];
        if (currentUser && currentUser._id === userId) {
            req.session["currentUser"] = { ...currentUser, ...userUpdates };
        }
        res.json(currentUser);
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
      

    const profile = (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
          res.sendStatus(401);
          return;
        }    
        res.json(currentUser);
    };
    app.post("/api/users/profile", profile);
}