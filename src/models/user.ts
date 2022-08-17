import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export interface IUser {
  username: string;
  password: string;
  clubhouse: boolean;
  admin?: boolean;
}

const UserSchema = new Schema<IUser>({
  username: {type: String, required: true, maxLength: 25},
  password: {type: String, required: true},
  clubhouse: {type: Boolean, required: true},
  admin: {type: Boolean},
})

const User = mongoose.model<IUser>("User", UserSchema);

export default User;