const jwt = require("jsonwebtoken");
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const bearertoken = req.header("Authorization");

    if (!bearertoken) {
        return res.status(401).json({ error: "Unauthorized - Token not provided" });
    }
    const bearer = bearertoken.split(" ");
    const token = bearer[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error('JWT Verification Error:', err);
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ error: "Unauthorized - Token expired" });
            } else {
                return res.status(403).json({ error: "Forbidden - Invalid token" });
            }
        }

        req.user = user;
        next();
    });
};

module.exports = { authenticateToken };

