const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/usersModel.js");
const { upload } = require("../middleware/multer.js")
const { authenticateToken } = require("../middleware/jwtValidator.js");
const { sendEmail } = require("../middleware/sendEmail.js");
const { generateRandomPassword } = require('../middleware/rendomPassword.js');
require('dotenv').config();


const saveUser = async (req, res, image) => {
    try {
        const randomPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(randomPassword, 8);

        const newUser = new UserModel({
            first_name: req.first_name,
            last_name: req.last_name,
            user_contact: req.user_contact,
            user_address: req.user_address,
            user_gender: req.user_gender,
            user_catagory: req.user_catagory,
            email: req.email,
            password: hashedPassword,
            user_salary: req.user_salary,
            user_image: image,
            write: req.write,
        });

        const username = req.email ? req.email : "";
        const userpassword = randomPassword ? randomPassword : "";
        const savedUser = await newUser.save();

        res.status(200).json({
            status: 200,
            data: {
                newUser
            },
            message: 'User has been created',
        });
        setTimeout(() => {
            if (res.status(200)) {
                // Send sign-up email
                sendEmail(req.email, 'signUp', { username: req?.email, userpassword: randomPassword });
            }

        }, 3000)
    } catch (error) {
        console.error('Save User Error:', error);
        res.status(500).json({ status: 500, error: 'Internal Server Error during user creation' });
    }
};


router.post("/", authenticateToken, upload.single("image"), async (req, res) => {
    try {
        const response = req.body;
        // const check = ()
        // Check if the email is already in use
        const existingUser = await UserModel.findOne({ email: response.email });
        if (existingUser) {
            return res.status(400).json({ status: 400, error: 'Email is already in use' });
        }
        // Continue with saving the user
        await saveUser(response, res, req.file.path);
    } catch (error) {
        console.error('Validation or Signup Error:', error);
        res.status(400).json({ status: 400, error: 'Validation failed or internal error' });
    }
});


module.exports = router;
