const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../../models/user.js");
const UserOTPVerification = require("../../models/otpVerification.js");

router.patch("/", async (req, res) => {
    try {
        const { userId, otp, password } = req.body;

        // Find the user in the database
        const user = await User.findOne({ _id: userId });

        if (userId === "") {
            res.status(401).json({ status: "401", message: 'User ID Should be Entered' });
        } else if (!user) {
            res.status(401).json({ status: "401", error: 'Invalid User ID' });
            return;
        }

        // Find the user in the database
        const userOTP = await UserOTPVerification.findOne({ userId: userId });
        if (!userOTP) {
            res.status(401).json({ status: "401", error: 'No OTP Available' });
            return;
        } else {
            if (userOTP.expireAt < Date.now()) {
                await UserOTPVerification.deleteMany({ expireAt: { $lt: currentTime } });

                res.status(401).json({ status: "401", error: 'OTP Expired' });
                return;
            }
        }

        const otpMatch = await bcrypt.compare(otp, userOTP.otp);

        if (otpMatch) {
            const hashedPassword = await bcrypt.hash(password, 8);
            const updatedUserData = {
                password: hashedPassword
            }
            const updatedUser = await User.findOneAndUpdate({ _id: userId }, updatedUserData, { new: true });
            await UserOTPVerification.deleteMany({ userId: userId });

            res.status(200).json({ status: "200", message: 'Sucess' });
        } else {
            res.status(401).json({ status: "401", message: 'Invalid Password' });
        }

    }
    catch (error) {
        res.status(500).json({ status: "500", message: 'Somthing Went Wrong' });
    }
});

module.exports = router;



