const mongoose = require("mongoose");
const Schema = mongoose.Schema

const userOTPVerification = new Schema({
    userId: { type: String },
    // email: { type: String },
    otp: { type: String },
    createdAt: {
        type: Date,
    },
    expireAt: {
        type: Date,
    }
});
const UserOTPVerification = mongoose.model("UserOTPVerification", userOTPVerification);

module.exports = UserOTPVerification;
