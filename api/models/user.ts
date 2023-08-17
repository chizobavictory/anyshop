import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  img?: string;
}

const UserSchema: Schema<IUser> = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  img: { type: String },
}, { timestamps: true });

const UserModel = mongoose.model<IUser>("User", UserSchema);

export default UserModel;
