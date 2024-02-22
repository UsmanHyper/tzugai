const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const UserOTPVerification = require("../models/otpVerification.js");
require('dotenv').config();


let token

router.post("/", async (req, res) => {
    try {
        const { userId, otpKey } = req.body;

        // Find the user in the database
        const user = await UserOTPVerification.findOne({ userId });
        const otpMatch = await bcrypt.compare(otpKey, user.otp);


        if (otpMatch) {
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
