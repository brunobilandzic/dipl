const { default: mongoose } = require("mongoose");

const adminSchema = {
  roleRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "RoleRequest" }],
};

export const Admin =
  mongoose.models.Admin ||
  mongoose.model("Admin", new mongoose.Schema(adminSchema));
