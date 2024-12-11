import mongoose from "mongoose";
import userSchema from "./schema.js";
const User = mongoose.model("UserModel", userSchema);

export default User;