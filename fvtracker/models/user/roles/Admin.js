const { default: mongoose } = require("mongoose");

const adminSchema = {
    roleRequests: [{type: mongoose.Schema.Types.ObjectId, ref: "RoleRequest"}],
}