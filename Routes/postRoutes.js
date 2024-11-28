import express from "express";
const router = express.Router();
import authMiddleware from "../middleware/authMiddleware.js";
import Post from "../Models/Post.js";

// Create Post
router.post('/create', authMiddleware, async (req, res) => {
  const { content, image } = req.body;
  try {
    const post = new Post({ content, image, author: req.user });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
