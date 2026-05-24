import mongoose from "mongoose";
import utils from "@/lib/utils";

const { Schema } = mongoose;

const appUserSchema = new Schema({
  rootManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RootManager",
    default: null,
  },
  username: {
    type: String,
  },
  name: {
    type: String,
  },
  slug: { type: String, unique: true, sparse: true, index: true },
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
  isAdmin: {
    type: Boolean,
    default: false,
  },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Worker",
    default: null,
  },
});

appUserSchema.pre("save", function (next) {
  if ((this.isModified("name") || this.isModified("surname")) && this.name) {
    const fullName = this.surname ? `${this.name} ${this.surname}` : this.name;
    this.slug = utils.strings.makeUrlFriendly(fullName);
  }
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
