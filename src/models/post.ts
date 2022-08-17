import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {type: String, required: true, maxLength: 75},
  content: {type: String, required: true, maxLength: 500},
  user: {type: mongoose.Types.ObjectId, ref: "User", required: true},
}, {timestamps: true})

const Post = mongoose.model('Post', PostSchema);

export default Post;