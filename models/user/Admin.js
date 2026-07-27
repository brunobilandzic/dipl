const { default: mongoose } = require("mongoose");

const { Schema } = mongoose;

const adminSchema = new Schema({
  appUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AppUser",
    required: true,
  },
  generalManagerRequests: [
    { type: mongoose.Schema.Types.ObjectId, ref: "GeneralManagerRequest" },
  ],
  roleRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "RoleRequest" }],
});

export const Admin =
  mongoose.models.Admin || mongoose.model("Admin", adminSchema);
