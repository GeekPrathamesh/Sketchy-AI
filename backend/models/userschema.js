import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const Userschema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    credits: { type: Number, default: 20 },
  },
  { timestamps: true }
);



const User = mongoose.model("User", Userschema);
export default User;
