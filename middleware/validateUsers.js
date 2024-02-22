const UserModel = require("../models/usersModel.js");

const validateUserData = async (req, res, next) => {
    const userData = req.body;
    if (!userData.email) {
        return res.status(400).json({ status: 400, error: 'Email are required' });
    }

    // Check Email Regex
    const emailRegex = /[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    if (!emailRegex.test(userData.email)) {
        return res.status(400).json({ status: 400, error: 'Invalid email format' });
    }

    // Check if the email is already in use
    const existingUser = await UserModel.findOne({ email: userData.email });
    if (existingUser) {
        return res.status(400).json({ status: 400, error: 'Email is already in use' });
    }

    next(); // Proceed to the next middleware or route handler
};

module.exports = { validateUserData };
