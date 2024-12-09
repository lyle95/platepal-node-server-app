// import mongoose from "mongoose";
// import bcrypt from "bcrypt";

// const userSchema = new mongoose.Schema(
//     {
//         username: { type: String, required: true, unique: true },
//         password: { type: String, required: true },
//         firstName: String,
//         lastName: String,
//         email: String,
//         dob: { type: Date, validate: { validator: (value) => value < new Date(), message: "Date of Birth must be in the past" } },
//         role: { type: String, enum: ["Cook", "Viewer", "Admin"], default: "Viewer" },
//         loginId: String,
//         createdAt: { type: Date, default: Date.now },
//         },
//         { collection: "users" }
// );
// export default userSchema;

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
    role: { type: String, enum: ["Cook", "Viewer", "Admin"], default: "Viewer" },
    loginId: String, // Include loginId
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "users" } // Ensure it uses the correct MongoDB collection
);

export default userSchema;
