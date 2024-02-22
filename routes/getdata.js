const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const { authenticateToken } = require("../middleware/jwtValidator.js");

router.get("/", authenticateToken, async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";

    const order = req.query.orderby || "asc";
    const sort = req.query.sortby || "name";

    let orderby = {};
    if (order.toLowerCase() === "asc") {
      orderby[sort] = 1; // 1 for ascending order, -1 for descending order
    } else {
      orderby[sort] = -1; // Assuming ascending order by default, modify as needed
    }

    const total = await User.countDocuments(); // Count all users
    const users = await User.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        // Add more fields as needed
      ]
    }).skip(skip).limit(limit).sort(orderby);

    if (users.length > 0) {
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
    } else {
      res.status(404).json({ status: 404, error: "Internal Server Error" });
    }
  } catch (error) {
    console.error("Error fetching all user data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

