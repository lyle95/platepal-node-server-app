import model from "./model.js";

export const followUser = async (followerId, followingId) => {
    try {
        const existingFollow = await model.findOne({ follower: followerId, following: followingId });
        if (existingFollow) throw new Error("Already following this user.");
        return await model.create({ follower: followerId, following: followingId });
    } catch (error) {
        throw new Error(`Error following user: ${error.message}`);
    }
};

export const unfollowUser = async (followerId, followingId) => {
    try {
        return await model.deleteOne({ follower: followerId, following: followingId });
    } catch (error) {
        throw new Error(`Error unfollowing user: ${error.message}`);
    }
};

export const isFollowing = async (followerId, followingId) => {
    try {
        const follow = await model.findOne({ follower: followerId, following: followingId });
        return !!follow; // Return true if the user is following, false otherwise
    } catch (error) {
        throw new Error(`Error checking follow status: ${error.message}`);
    }
};


export const countFollowers = async (userId) => {
    try {
        return await model.countDocuments({ following: userId });
    } catch (error) {
        throw new Error(`Error counting followers: ${error.message}`);
    }
};

export const countFollowing = async (userId) => {
    try {
        return await model.countDocuments({ follower: userId });
    } catch (error) {
        throw new Error(`Error counting following: ${error.message}`);
    }
};

export const findFollowers = async (userId) => {
    try {
        return await model.find({ following: userId }).populate("follower", "username");
    } catch (error) {
        throw new Error(`Error finding followers: ${error.message}`);
    }
};

export const findFollowing = async (userId) => {
    try {
        return await model.find({ follower: userId }).populate("following", "username");
    } catch (error) {
        throw new Error(`Error finding following: ${error.message}`);
    }
};