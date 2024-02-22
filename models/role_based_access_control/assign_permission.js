const mongoose = require("mongoose");

const createRoleSchema = new mongoose.Schema({
    user_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'NewRole', required: true },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const NewRole = mongoose.model("NewRole", createRoleSchema);

module.exports = NewRole;
