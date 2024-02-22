const express = require("express");
const router = express.Router();
const Subscriber = require("../models/subscribers/subcribers.js");
const { authenticateToken } = require("../middleware/jwtValidator.js");

require('dotenv').config();

// router.get("/", authenticateToken, upload.single("image"), async (req, res) => {
router.get("/", async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const search = req.query.search || "";

        const order = req.query.orderby || "asc";
        const sort = req.query.sortby || "first_name";

        let orderby = {};
        if (order.toLowerCase() === "asc") {
            orderby[sort] = 1; // 1 for ascending order, -1 for descending order
        } else {
            orderby[sort] = -1; // Assuming ascending order by default, modify as needed
        }

        const total = await Subscriber.countDocuments(); // Count all users
        const users = await Subscriber.find({
            $or: [
                { first_name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                // Add more fields as needed
            ]
        }).skip(skip).limit(limit).sort(orderby);

        res.status(200).json({
            status: "Success",
            data: { users },
            message: "Users fetched successfully",
            currentPage: page,
            totalDatainData: users.length,
            totalData: total,
            nextPage: total > skip + limit,
            prevPage: page !== 1,
        });
    } catch (error) {
        console.error("Error fetching all user data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
