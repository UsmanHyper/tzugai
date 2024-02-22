const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user.js");
const { validateUserData } = require("../middleware/signUpValidation.js");
// const { sendEmail } = require("../middleware/sendEmail.js");
const { generateRandomPassword } = require('../middleware/rendomPassword.js');

require('dotenv').config();


const saveUser = async (userData, res) => {
    try {
        const randomPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(randomPassword, 8);

        const newUser = new User({
            email: userData.email,
            password: hashedPassword,
        });

        const username = userData.email ? userData.email : "";
        const userpassword = randomPassword ? randomPassword : "";

        const savedUser = await newUser.save();

        res.status(200).json({
            status: 200,
            data: {
                userId: savedUser._id,
                email: savedUser.email,
                password: randomPassword,
            },
            message: 'User has been created',
        });
    } catch (error) {
        console.error('Save User Error:', error);
        res.status(500).json({ status: 500, error: 'Internal Server Error during user creation' });
    }
};


router.post("/", validateUserData, async (req, res) => {
    console.log("================>", req)
    try {

        const userData = req.body;
        // Check if the email is already in use
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            return res.status(400).json({ status: 400, error: 'Email is already in use' });
        }

        // Continue with saving the user
        await saveUser(userData, res);
    } catch (error) {
        console.error('Validation or Signup Error:', error);
        res.status(400).json({ status: 400, error: 'Validation failed or internal error' });
    }
});

module.exports = router;
