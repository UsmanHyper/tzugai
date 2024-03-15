const express = require("express");
const router = express.Router();
const Subscriber = require("../models/subscribers/subcribers.js");
require('dotenv').config();
const { validateUserData } = require('../middleware/validateUsers.js')
const { send_Email } = require("../middleware/sendEmail.js");

const saveUser = async (req, res, image) => {
    try {

        const newUser = new Subscriber({
            // first_name: req.first_name,
            // last_name: req.last_name,
            email: req.email,
            // phone: req.phone,
        });

        const username = req.email ? req.email : "";
        const savedUser = await newUser.save();
        await send_Email(req.email, 'Subscribe', { username: req?.email });
        return res.status(200).json({
            status: 200,
            data: {
                newUser
            },
            message: 'Subscriber has been created',
        });

        // setTimeout(() => {
        //     if (res.status(200)) {
        //         // Send sign-up email
        //         send_Email(req.email, 'Subscribe', { username: req?.email });
        //     }

        // }, 3000)
    } catch (error) {
        console.error('Save Subscriber Error:', error);
        res.status(500).json({ status: 500, error: 'Internal Server Error during Subscriber creation' });
    }
};
// router.post("/", validateUserData, async (req, res) => {

//     send_Email(req.email, 'Subscribe', { username: req?.email });
// })


router.post("/", validateUserData, async (req, res, next) => {
    try {
        const response = req.body;
        // Check if the email is already in use
        const existingUser = await Subscriber.findOne({ email: response.email });
        if (existingUser) {
            return res.status(400).json({ status: 400, error: 'Email is already in use' });
        }
        // Continue with saving the user
        await saveUser(response, res, req.file ? req.file.path : null);
    } catch (error) {
        console.error('Validation or Signup Error:', error);
        // Pass error to the next middleware
        next(error);
    }
});



module.exports = router;
