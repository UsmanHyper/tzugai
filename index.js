const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/user.js");
const multer = require('multer');
const upload = multer({ dest: 'C:/usman/new data base/images' });
require('dotenv').config();

const mongooseConnection = require("./db/mongodb.js");

const corsMiddleware = require("./middleware/cors_middleware");

const subscribed = require("./routes/subscribed.js");
const signinRoute = require("./routes/signin.js");
const signupRoute = require("./routes/signup.js");
const getAll = require("./routes/get_all_subs.js");
const delSub = require("./routes/delete_subs.js");

const app = express();
const PORT =  process.env.PORT;
require('dotenv').config();

app.use(corsMiddleware);
app.use(bodyParser.json());

// const cron = cronjob


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
    app.use("/api/subscribed", subscribed);
    app.use("/api/signin", signinRoute);
    app.use("/api/signup", signupRoute);
    app.use("/api/get_all", getAll);
    app.use("/api/del_sub", delSub);

    // Other code related to Express setup, routes, and starting the server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });

});