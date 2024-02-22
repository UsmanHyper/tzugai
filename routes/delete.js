const express = require("express");
const router = express.Router();
const Subscriber = require("../models/subscribers/subcribers.js");

router.delete("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    await Subscriber.deleteOne({ _id: userId });

    res.status(200).json({ message: 'Subscriber deleted successfully' });
  } catch (error) {
    console.error('Error deleting Subscriber:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
