import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: String,
    lastName: String,
    email: { type: String, required: true, unique: true },
    dob: {
      type: Date,
      validate: {
        validator: (value) => value < new Date(),
        message: "Date of Birth must be in the past",
      },
    },
    role: { type: String, enum: ["Cook", "Viewer", "Admin"], default: "Cook" },
    loginId: String, // Include loginId
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "users" } // Ensure it uses the correct MongoDB collection
);

export default userSchema;
