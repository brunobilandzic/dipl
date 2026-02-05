import mongoose from "mongoose";

const { Schema } = mongoose;

const appUserSchema = new Schema({
  rootManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RootManager",
  },
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
});

appUserSchema.methods.getRootManager = async function () {
  await this.populate("rootManager");
  return this.rootManager;
};

appUserSchema.methods.getSpecificManager = async function (managerModelName) {
  const rootManager = await this.getRootManager();
  if (!rootManager) {
    return null;
  }
  const specificManager = await mongoose
    .model(managerModelName)
    .findOne({ rootManager: rootManager._id });
    
  return specificManager;
};

export const AppUser =
  mongoose.models.AppUser || mongoose.model("AppUser", appUserSchema);
