import mongoose from "mongoose";
import userSchema from "./schema.js";
const User = mongoose.model("User", userSchema);

export default User;