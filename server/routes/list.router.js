const { application } = require('express');
const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');

router.get('/', (req, res) => {
    res.status(200).send('Hello');
})
// .catch(error => {
//         console.log('Error while getting list.', error);
//         res.sendStatus(500);
//     });
module.exports = router;