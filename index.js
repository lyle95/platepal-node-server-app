import 'dotenv/config';
import express from 'express';
import path from "path";
import { fileURLToPath } from "url";
import mongoose from 'mongoose';
import cors from 'cors';
import Hello from "./Hello.js";
import UserRoutes from './users/routes.js';
import session from 'express-session';
import RecipeRoutes from './recipes/routes.js';
import FollowRoutes from './follows/routes.js';
import CommentRoutes from './comments/routes.js';
import LikeRoutes from './likes/routes.js';
const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/platepal"
mongoose.connect(CONNECTION_STRING);
const app = express()
app.use(cors({
    credentials: true,
    origin: process.env.NETLIFY_URL || "http://localhost:3000", 
}));
const sessionOptions = {
    secret: process.env.SESSION_SECRET || "platepal",
    resave: false,
    saveUninitialized: false,
};
if (process.env.NODE_ENV !== "development") {
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
      sameSite: "none",
      secure: true,
      domain: process.env.NODE_SERVER_DOMAIN,
    };
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(session(sessionOptions));  
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
Hello(app);
UserRoutes(app);
RecipeRoutes(app);
FollowRoutes(app);
CommentRoutes(app);
LikeRoutes(app);
app.listen(process.env.PORT || 8080, () => {
  console.log( `Server is running on ${PORT}`);
})