const { default: mongoose } = require("mongoose");

const { Schema } = mongoose;

const adminSchema = new Schema({
  roleRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "RoleRequest" }],
});

export const Admin =
  mongoose.models.Admin || mongoose.model("Admin", adminSchema);
