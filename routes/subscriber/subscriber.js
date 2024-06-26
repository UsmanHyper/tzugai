const express = require('express');
const router = express.Router();
const subs = require('../../controllers/subscribers/subscribers.js');
const { authenticateToken } = require('../../middleware/jwtValidator.js')
require('dotenv').config();


router.post('/add', subs.add);
router.post('/delete_all',  subs.del_all);
router.delete('/delete_one/:id',  subs.del_one);
router.get('/all_subscribers',  subs.get_all);
router.get('/one_subscriber/:id',  subs.get_one);
router.get('/sub_test',  subs.test);



router.get("/", async (req, res) => {
    res.status(500).send('Node User Working')
})

module.exports = router;