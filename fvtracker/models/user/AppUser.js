import mongoose from "mongoose";

const appUserSchema = {
  name: {
    type: String,
  },
  surname: {
    type: String,
  },
  email: {
    type: String,
  },
};

export const AppUser =
  mongoose.models.AppUser ||
  mongoose.model("AppUser", new mongoose.Schema(appUserSchema));
