const express = require("express");
const morgan = require('morgan');
const bodyParser = require("body-parser");
// const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/user.js");
const cronjob = require("./middleware/cron_job.js");
const multer = require('multer');
const upload = multer({ dest: 'C:/usman/new data base/images' });

const mongooseConnection = require("./db/mongodb.js");

// const cron = require("node-cron");
const corsMiddleware = require("./middleware/cors_middleware");

const UserOTPVerification = require("./models/otpVerification.js");

const app = express();
const PORT = 3000;
require('dotenv').config();

app.use(corsMiddleware);

// Middleware
// app.use(cors());
app.use(bodyParser.json());

const cron = cronjob


const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'C:/usman/new data base/images');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname);
    }
});



mongooseConnection.on('open', () => {
    console.log('MongoDB connected');

    // Use the imported routes


    // Other code related to Express setup, routes, and starting the server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });

});