const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../models/user.js");
require('dotenv').config();

let token;
let payload;
let user;
let passwordMatch;

router.post("/", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user in the database
        user = await Users.findOne({ email: email });

        if (!user) {
            return res.status(401).json({ status: "401", error: 'Invalid Email' });
        }

        // Compare passwords
        passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            payload = {
                userId: user._id,
                email: user.email,
                // Add other properties to payload as needed
            };

            // Generate a JWT token
            token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

            res.status(200).json({ status: "200", token: token, userId: user._id, data: payload });
        } else {
            res.status(401).json({ status: "401", error: 'Invalid Password' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ status: "500", error: 'Something Went Wrong' });
    }
});

module.exports = router;
