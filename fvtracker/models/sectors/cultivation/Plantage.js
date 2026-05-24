import { AppUser } from "@/models/user/AppUser";
import { Schema } from "mongoose";

const plantageSchema = new Schema(
  {
    planredCropVarieties: [
      {
        type: Schema.Types.ObjectId,
        ref: "PlantedCropVariety",
      },
    ],
    workerUsername: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

plantageSchema.methods.workerAppUser = async function () {
  const appUser = await AppUser.findOne({ username: this.workerUsername });
  return appUser;
};

export const Plantage = mongoose.model("Plantage", plantageSchema);
