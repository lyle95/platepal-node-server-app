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
import MongoStore from 'connect-mongo';
const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/platepal"
mongoose.connect(CONNECTION_STRING);
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB database: ${mongoose.connection.name}`);
  console.log(`Connected to MongoDB host: ${mongoose.connection.host}`);
  console.log(`MongoDB connection string: ${CONNECTION_STRING}`);
});

mongoose.connection.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err);
});
const app = express()
const corsOptions = {
  credentials: true,
  origin: process.env.NODE_ENV === "production"
    ? [process.env.NETLIFY_URL, "https://platepal-node-server-app.onrender.com"]
    : "http://localhost:3000",
};
app.use(cors(corsOptions));
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "platepal",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
      mongoUrl: process.env.MONGO_CONNECTION_STRING,
      collectionName: 'sessions',
  }),
};
if (process.env.NODE_ENV === "production") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
      sameSite: "none",
      secure: true,
      domain: new URL(process.env.NODE_SERVER_DOMAIN).hostname,
  };
}
app.use(session(sessionOptions));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
Hello(app);
UserRoutes(app);
RecipeRoutes(app);
FollowRoutes(app);
CommentRoutes(app);
LikeRoutes(app);
const PORT = 8080; 
app.listen(PORT, () => {
  const serverURL = process.env.NODE_ENV === "production"
    ? process.env.NODE_SERVER_DOMAIN
    : `http://localhost:${PORT}`;
console.log(`Server is running on ${serverURL}`);
});