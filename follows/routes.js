import * as dao from "./dao.js";

export default function FollowRoutes(app) {
    const followUser = async (req, res) => {
        const { followerId, followingId } = req.body;
        try {
            if (!followerId || !followingId) {
                return res.status(400).json({ message: "Follower ID and Following ID are required." });
            }
            const follow = await dao.followUser(followerId, followingId);
            res.json(follow);
        } catch (error) {
            console.error("Error following user:", error.message); // Add logging
            res.status(500).json({ message: error.message });
        }
    };    
    app.post("/api/follows", followUser);

    const unfollowUser = async (req, res) => {
        const { followerId, followingId } = req.body;
        try {
            const result = await dao.unfollowUser(followerId, followingId);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    app.delete("/api/follows", unfollowUser);

    const isFollowing = async (req, res) => {
        const { followerId, followingId } = req.query;
        try {
            const following = await dao.isFollowing(followerId, followingId);
            res.json({ following });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    app.get("/api/follows/status", isFollowing);

    const findFollowers = async (req, res) => {
        const { userId } = req.params;
        try {
            const followers = await dao.findFollowers(userId);
            res.json(followers);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    app.get("/api/follows/followers/:userId", findFollowers);

    const findFollowing = async (req, res) => {
        const { userId } = req.params;
        try {
            const following = await dao.findFollowing(userId);
            res.json(following);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    app.get("/api/follows/following/:userId", findFollowing);
}