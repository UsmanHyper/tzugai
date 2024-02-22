const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const { authenticateToken } = require("../middleware/jwtValidator.js");

let changesMade = ""

router.patch("/:userId", authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const updatedUserData = req.body;

    if (!updatedUserData.name) {
      return res.status(400).json({ error: 'Name field is required for update.' });
    } else {
      changesMade = changesMade.concat("Name Has Been Changed ")
    }

    const updatedUser = await User.findOneAndUpdate({ _id: userId }, updatedUserData, { new: true });

    res.status(200).json({
      status: 200,
      data: {
        userId: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        date: updatedUser.date,
      },
      message: changesMade,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;


