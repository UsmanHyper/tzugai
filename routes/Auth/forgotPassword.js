const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
// const cron = require("node-cron");

const User = require("../../models/user.js");
const UserOTPVerification = require("../../models/otpVerification.js");

const { sendEmail } = require("../../middleware/sendEmail.js");
const { generateOTP } = require("../../middleware/genrateOtp.js");

const STATUS_SUCCESS = 200;
const STATUS_BAD_REQUEST = 401;
const STATUS_INTERNAL_SERVER_ERROR = 500;

// // let otpKeyData
router.post("/", async (req, res) => {
    try {
        const { email } = req.body;
        // Find the user in the database
        const user = await User.findOne({ email: email });

        if (email === "") {
            res.status(401).json({ status: "401", message: 'Email Should be Entered' });
        } else if (!user) {
            res.status(401).json({ status: "401", error: 'Invalid Email' });
            return;
        }

        let userId = user._id

        const otpKeyData = generateOTP();
        const hashedOTP = await bcrypt.hash(otpKeyData, 8);

        const checkUser = await UserOTPVerification.findOne({ userId: userId })
        if (checkUser) {

            const otpUpdate = {
                // userId: checkUser.userId,
                otp: hashedOTP,
                createdAt: Date.now(),
                expireAt: Date.now() + 300000
                // expireAt: Date.now() + 360000,
            };
            const updateOtp = await UserOTPVerification.findByIdAndUpdate(
                { _id: checkUser._id },
                otpUpdate, { new: true }
            );
            res.status(200).json({ status: "200", message: 'OTP re-sent successfully' });
        }
        else {
            const otpVerification = new UserOTPVerification({
                userId: user._id,
                // email: email,
                otp: hashedOTP,
                createdAt: Date.now(),
                expireAt: Date.now() + 360000, // Fixed duplicate createdAt key
            });
            await otpVerification.save();
            res.status(200).json({ status: "200", message: 'OTP sent successfully' });
        }

        await sentOTPVerificationEmail(user.email, otpKeyData);
        // Respond to the client if needed

    } catch (error) {
    }
});

// Fixed the function definition and added missing parameters
const sentOTPVerificationEmail = async (user, oTp) => {

    await sendEmail(user, 'verifyPassoword', { otpKey: oTp });

};

module.exports = router;


