import mongoose from "mongoose";

const appUserSchema = {
  username: {
    type: String,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  surname: {
    type: String,
  },
  provider: {
    type: String,
    enum: ["google", "credentials"],
    default: "credentials",
  },
};

export const AppUser =
  mongoose.models.AppUser ||
  mongoose.model("AppUser", new mongoose.Schema(appUserSchema));
