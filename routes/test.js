const express = require("express");
const router = express.Router();


router.get("/", async (req, res) => {
    res.status(500).send('Node Working')
})

module.exports = router;