const express = require('express');
const router = express.Router();
const subs = require('./subscriber/subscriber.js');


router.use('/subscribed', subs)

router.get("/", async (req, res) => {
    res.status(500).send('Node Working')
})



module.exports = router;