// Import necessary modules
const express = require("express");
const bodyParser = require("body-parser");
const mongooseConnection = require("./db/mongodb.js");
const corsMiddleware = require("./middleware/cors_middleware");
const subscribed = require("./routes/subscribed.js");
const signinRoute = require("./routes/signin.js");
const signupRoute = require("./routes/signup.js");
const getAll = require("./routes/get_all_subs.js");
const delSub = require("./routes/delete_subs.js");
const test = require("./routes/test.js");
const multer = require('multer');
require('dotenv').config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(corsMiddleware);
app.use(bodyParser.json());


const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'C:/usman/new data base/images');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname);
    }
});


// MongoDB Connection
mongooseConnection.on('open', () => {
    console.log('MongoDB connected');

    // Routes
    app.use("/api/subscribed", subscribed);
    app.use("/api/signin", signinRoute);
    app.use("/api/signup", signupRoute);
    app.use("/api/get_all", getAll);
    app.use("/api/del_sub", delSub);
    app.use("/api/test", test);
    app.use("/", test);
   

    // Error handling middleware
    // app.use((err, req, res, next) => {
    //     console.error(err.stack);
    //     res.status(500).send('Something broke!');
    // });

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
