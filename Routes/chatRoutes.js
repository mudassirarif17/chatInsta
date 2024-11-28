import express from "express";
const router = express.Router();
import authMiddleware from "../middleware/authMiddleware.js";
import Chat from "../Models/Chat.js";
import User from "../Models/User.js";

// Get or Create Chat Room
router.post('/room', authMiddleware, async (req, res) => {
  const { recipientId } = req.body;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [req.user, recipientId] },
    }).populate('participants', 'username');

    if (!chat) {
      chat = new Chat({ participants: [req.user, recipientId] });
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch Messages for a Chat Room
router.get('/:roomId', authMiddleware, async (req, res) => {
  const { roomId } = req.params;

  try {
    const chat = await Chat.findById(roomId)
      .populate('messages.sender', 'username')
      .populate('participants', 'username');

    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send a Message
router.post('/:roomId/message', authMiddleware, async (req, res) => {
  const { roomId } = req.params;
  const { text } = req.body;

  try {
    const chat = await Chat.findById(roomId);

    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    const message = { sender: req.user, text };
    chat.messages.push(message);

    await chat.save();

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
