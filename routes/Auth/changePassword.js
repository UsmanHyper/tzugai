const express = require("express");
const router = express.Router();
const { sendEmail } = require("../../middleware/sendEmail.js");

const bcrypt = require("bcrypt");
const User = require("../../models/user.js");

router.patch("/", async (req, res) => {
    try {
        const { userId, password, changepassword } = req.body;

        // Find the user in the database
        const user = await User.findOne({ _id: userId });

        if (userId === "") {
            res.status(401).json({ status: "401", message: 'User ID Should be Entered' });
        } else if (!user) {
            res.status(401).json({ status: "401", error: 'Invalid User ID' });
            return;
        }
        const checkPassword = await bcrypt.compare(password, user.password);

        if (checkPassword) {
            const hashedPassword = await bcrypt.hash(changepassword, 8);
            const updatedUserData = {
                password: hashedPassword
            }
            const updatedUser = await User.findOneAndUpdate({ _id: userId }, updatedUserData, { new: true });

            res.status(200).json({ status: "200", message: 'Sucess has been changed' });
            await sentVerificationEmail(user.email);

        } else {
            res.status(401).json({ status: "401", message: 'Invalid Password' });
        }

    }
    catch (error) {
        res.status(500).json({ status: "500", message: 'Somthing Went Wrong' });
    }
});

const sentVerificationEmail = async (user) => {
    await sendEmail(user, 'verificationEmail');
};


module.exports = router;