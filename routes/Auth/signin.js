const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/user.js");
require('dotenv').config();
const UserModel = require("../../models/usersModel.js");

let token
let payload
let user
let users
let dt
let passwordMatch

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user in the database
    user = await User.findOne({ email });
    users = await UserModel.findOne({ email });

    if (user) {
      dt = user
    } else if (users) {
      dt = users
    } else {
      return
    }

    if (email == "" || password == "") {
      res.status(401).json({ status: "401", message: 'Email and Password Should be Entered' });
    }
    else if (!user && !users) {
      res.status(401).json({ status: "401", error: 'Invalid Email' });
      return;
    } else {

      console.log("pp", dt.password)
      console.log("pp", dt)

      passwordMatch = await bcrypt.compare(password, dt.password);
      if (user) {
        payload = {
          userId: date._id,
          email: date.email,
          name: date.name,
          date: date.date,
        };

      } else if (users) {
        payload = {
          userId: dt._id,
          first_name: dt.first_name,
          last_name: dt.last_name,
          user_contact: dt.user_contact,
          user_address: dt.user_address,
          user_gender: dt.user_gender,
          user_catagory: dt.user_catagory,
          email: dt.email,
          user_salary: dt.user_salary,
          user_image: dt.user_image,
          date: dt.date,
          write: dt.write,
        };
      } else {
        return
      }

      // Generate a JWT token
      token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

      if (passwordMatch) {
        res.status(200).json({ status: "200", token: token, userId: dt._id, data: payload });
      } else {
        res.status(401).json({ status: "401", error: 'Invalid Password' });
      }
    }
  }
  catch (error) {
    res.status(500).json({ status: "500", error: 'Somthing Went Wrong' });
  }
});

module.exports = router;
