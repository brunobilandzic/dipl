import { ROLE_STATUSES } from "@/lib/constants/users";
import { GeneralManagerRequest } from "@/models/documents/requests/RoleRequest";
import mongoose, { Schema } from "mongoose";

const generalManagerSchema = new Schema({
  rootManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RootManager",
    default: null,
  },
  managers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "RootManager", default: [] },
  ],
  roleRequests: [
    { type: mongoose.Schema.Types.ObjectId, ref: "RoleRequest", default: [] },
  ],
  generalManagerRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GeneralManagerRequest",
    default: null,
  },
});

generalManagerSchema.pre("save", async function () {
  if (this.isNew) {
    const generalManagerRequest = await GeneralManagerRequest.create({
      generalManager: this._id,
    });
    this.generalManagerRequest = generalManagerRequest._id;

    await generalManagerRequest.save();
  }
});

generalManagerSchema.method.getRoleRequests = async function () {
  const roleRequests = [];
  const managers = await mongoose.models.RootManager.find({
    generalManager: this._id,
  }).populate("roleRequest");
  for (const manager of managers) {
    if (manager.roleRequest) {
      roleRequests.push(manager.roleRequest);
    }
  }
  return roleRequests;
};

generalManagerSchema.method.approveRoleRequest = async function ({
  requestId,
  status,
}) {
  const roleRequest = await mongoose.models.RoleRequest.findById(requestId);
  if (!roleRequest) {
    throw new Error("Role Request not found");
  }
  if (roleRequest.generalManager.toString() !== this._id.toString()) {
    throw new Error(
      "Unauthorized: Role Request does not belong to this General Manager",
    );
  }
  roleRequest.status = status;
  await roleRequest.save();
  return roleRequest;
};

export const GeneralManager =
  mongoose.models.GeneralManager ||
  mongoose.model("GeneralManager", generalManagerSchema);
