const express = require("express");
const router = express.Router();
const User = require("../models/subscribers/subcribers.js");

router.delete("/:userId", async (req, res) => {
    console.log("::::::::::::::::::::::::>:::<:::<:::::")

    try {
        const userId = req.params.userId;

        await User.deleteOne({ _id: userId });

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
