const express = require('express'); //bring in express
const router = express.Router(); //establish router method

//bring in pool to allow connection to database
const pool = require('../modules/pool'); 

//get table from database or display an error
router.get('/', (req, res) => {
    let queryText = 'SELECT * FROM "list" ORDER BY "priority" ASC;';
    pool.query(queryText).then(result => {
        // Sends back the results in an object
        res.status(200).send(result.rows);
    })
        .catch(error => {
            console.log('error getting books', error);
            res.sendStatus(500); //throw error
        });
});

router.post('/', (req, res) => {
    let newListItem = req.body;
    console.log(`Adding book`, newListItem);

    let queryText = `INSERT INTO "list" ("note", "category", "priority", "isComplete", "timeCompleted")
                   VALUES ($1, $2, $3, $4, $5);`;
    pool.query(queryText, [newListItem.note, newListItem.category, newListItem.priority, newListItem.isComplete, newListItem.timeCompleted])
        .then(result => {
            res.sendStatus(201);
        })
        .catch(error => {
            console.log(`Error adding new book`, error);
            res.sendStatus(500);
        });
});

module.exports = router; //export appropriate route to server.js