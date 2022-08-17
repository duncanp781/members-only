import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {type: String, required: true, maxLength: 25},
  password: {type: String, required: true},
  clubhouse: {type: Boolean, required: true},
  admin: {type: Boolean},
})

const User = mongoose.model("User", UserSchema);

export default User;