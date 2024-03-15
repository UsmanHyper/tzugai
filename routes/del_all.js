const express = require("express");
const router = express.Router();
const Subscriber = require("../models/subscribers/subcribers.js");

router.post("/", async (req, res) => {
    try {
        // Delete all subscribers
        const result = await Subscriber.deleteMany({});

        // Check if any subscribers were deleted
        if (result.deletedCount > 0) {
            res.status(200).json({ message: "All subscribers deleted successfully" });
        } else {
            res.status(404).json({ message: "No subscribers found" });
        }
    } catch (error) {
        console.error("Error deleting subscribers:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
