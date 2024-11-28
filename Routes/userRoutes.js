import express from "express";
const router = express.Router();
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../Models/User.js";

// Follow/Unfollow User
router.put('/follow/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(req.user);
    const targetUser = await User.findById(id);

    if (targetUser.followers.includes(req.user)) {
      targetUser.followers = targetUser.followers.filter(f => f.toString() !== req.user);
      user.following = user.following.filter(f => f.toString() !== id);
    } else {
      targetUser.followers.push(req.user);
      user.following.push(id);
    }

    await user.save();
    await targetUser.save();

    res.json({ message: 'Updated follow status' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

