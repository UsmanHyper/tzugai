const mongoose = require("mongoose");

const createRoleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    features: [{ type: String, required: false }], // Array of strings representing the permissions/features that this role has access to   
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const NewRole = mongoose.model("NewRole", createRoleSchema);

module.exports = NewRole;
