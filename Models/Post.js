import mongoose , {model} from 'mongoose';
import bcrypt from "bcrypt"


const postSchema = new mongoose.Schema({
  content: { type: String, required: true },
  image: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: { type: String, required: true },
    },
  ],
}, { timestamps: true });


const Post = model('Post', postSchema);
export default Post;

