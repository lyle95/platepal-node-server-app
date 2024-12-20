import User from "./model.js";
import FollowModel from "../follows/model.js";
import mongoose from 'mongoose';

// Create a new user
export const createUser = async ({ username, email, password }) => {
    try {
        const user = new User({ username, email, password }); // Ensure the schema matches
        await user.save();
        return user;
    } catch (err) {
        console.error('Error creating user:', err);
        throw new Error('Error creating user: ' + err.message);
    }
};

// Find all users
export const findAllUsers = async () => {
    try {
        return await User.find();
    } catch (error) {
        throw new Error(`Error finding all users: ${error.message}`);
    }
};

// Find a user by username
export const findUserByUsername = async (username) => {
    try {
        return await User.findOne({ username });
    } catch (error) {
        throw new Error(`Error finding user by username: ${error.message}`);
    }
};

// Find a user by ID
export const findUserById = async (userId) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid ObjectId');
        }
        return await User.findById(userId).select("-password"); // Remove `.populate()` calls
    } catch (error) {
        throw new Error(`Error finding user by ID: ${error.message}`);
    }
  };
  

// Find a user by credetials
export const findUserByCredentials = async (username, password) => {
    try {
        return await User.findOne({ username, password });
    } catch (error) {
        throw new Error(`Error finding user by credentials: ${error.message}`);
    }
};

// Find users by role
export const findUsersByRole = async (role) => {
    try {
        return await User.find({ role });
    } catch (error) {
        throw new Error(`Error finding users by role: ${error.message}`);
    }
};

// Find users by partial username
export const findUsersByPartialUsername = async (partialUsername) => {
    try {
        const regex = new RegExp(partialUsername, "i"); // Case-insensitive regex
        return await User.find({
          username: { $regex: regex },
        });
    } catch (error) {
        throw new Error(`Error finding users by partial name: ${error.message}`);
    }
};

// Update a user
export const updateUser = async (userId, user) => {
    console.log('Updating user in DB:', user); 
    try {
        return await User.updateOne({ _id: userId }, { $set: user });
    } catch (error) {
        throw new Error(`Error updating user: ${error.message}`);
    }
};

// Delete a user
export const deleteUser = async (userId) => {
    try {
        return await User.deleteOne({ _id: userId });
    } catch (error) {
        throw new Error(`Error deleting user: ${error.message}`);
    }
};

export const findUserByEmail = async (email) => {
  return User.findOne({ email });
};

export const searchUsersWithFollowCounts = async (username, currentUserId) => {
    try {
      const users = await User.find({ username: new RegExp(username, "i") }).select("_id username role");
      const results = await Promise.all(
        users.map(async (user) => {
            const followersCount = await FollowModel.countDocuments({ following: user._id });
            const followingCount = await FollowModel.countDocuments({ follower: user._id });
            const isFollowing = !!(await FollowModel.exists({ follower: currentUserId, following: user._id }));
            return {
                ...user.toObject(),
                followers: followersCount, // Total followers
                following: followingCount, // Total following
                isFollowing: !!isFollowing, // Whether the current user follows this user
            };
        })
      );
      return results;
    } catch (error) {
      throw new Error(`Error searching users: ${error.message}`);
    }
  };  



