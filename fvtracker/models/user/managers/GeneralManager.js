import { ROLE_STATUSES } from "@/lib/constants/users";
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
  employmentRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmploymentRequest",
      default: [],
    },
  ],
  orderRequests: [
    { type: mongoose.Schema.Types.ObjectId, ref: "OrderRequest", default: [] },
  ],
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

generalManagerSchema.method.getPendingRoleRequests = async function () {
  const roleRequests = await this.getRoleRequests();
  return roleRequests.filter(
    (request) => request.status === ROLE_STATUSES.PENDING,
  );
};

export const GeneralManager =
  mongoose.models.GeneralManager ||
  mongoose.model("GeneralManager", generalManagerSchema);
