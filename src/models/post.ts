import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export interface IPost{
  title: string;
  content: string;
  user: mongoose.Types.ObjectId;
}

const PostSchema = new Schema<IPost>({
  title: {type: String, required: true, maxLength: 75},
  content: {type: String, required: true, maxLength: 500},
  user: {type: Schema.Types.ObjectId, ref: "User", required: true},
}, {timestamps: true})

const Post = mongoose.model<IPost>('Post', PostSchema);

export default Post;