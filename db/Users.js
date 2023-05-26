import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    payment_method: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: false,
    },
    months: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    process: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);
const AdminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    admin: {
      type: Boolean,
      required: true,
    },
    pass: {
      type: String,
      required: true,
    },
  },
  { timeStamps: true }
);
export const UserModel = mongoose.model("buyers", UserSchema);

export const AdminModel = mongoose.model("admins", AdminSchema);
