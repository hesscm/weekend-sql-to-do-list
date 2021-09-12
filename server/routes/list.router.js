const express = require('express'); //bring in express
const router = express.Router(); //establish router method

//bring in pool to allow connection to database
const pool = require('../modules/pool'); 

//get table from database or display an error
router.get('/', (req, res) => {
    let queryText = 'SELECT * FROM "list" ORDER BY "isComplete" ASC;';
    pool.query(queryText).then(result => {
        // Sends back the results in an object
        res.status(200).send(result.rows);
    })
        .catch(error => {
            console.log('error getting books', error);
            res.sendStatus(500); //throw error
        });
});

//POST for sort option so we can transfer data from client to server
//sorts the return based on user request
router.post('/sort', (req, res) => {
    //identify allowed sorting options
    let sortOptions = ["id", "priority", "category", "isComplete", "timeCompleted", "reversed"];
    let option = '"id" ASC;'; //id by default so program doesn't break
    console.log("server sort get", req.body.option);
    //loop through sortOptions and try and find match to the request
    for (let i = 0; i < sortOptions.length; i++) {
        //reversed does not exist in the database so check this specifically
        if (req.body.option === sortOptions[5]) {
            option = '"id" DESC;'; //order by id in a descending order
        } else if (sortOptions[i] === req.body.option) { //if a match...
            option = `"${sortOptions[i]}" ASC;`; //sort option is the request
        }
    }
    //set query for database
    let queryText = `SELECT * FROM "list" ORDER BY ${option}`;
    console.log(queryText);
    //send query to database
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

router.put('/:id', (req, res) => {
    let reqId = req.params.id;
    let sqlText = '';
    console.log('Put request for id', reqId);
    if (req.body.isComplete === 'true') {
        sqlText = 'UPDATE "list" SET "isComplete" = false WHERE "id" = $1;'
    }
    else {
        sqlText = 'UPDATE "list" SET "isComplete" = true WHERE "id" = $1;'
    }
    // let sqlTextifTrue = 'UPDATE "list" SET "isComplete" = false WHERE "id" = $1;'
    pool.query(sqlText, [reqId])
        .then((result) => {
            console.log('List updated');
            res.sendStatus(201);
        })
        .catch((error) => {
            console.log(`Error making database query ${sqlText}`, error);
            res.sendStatus(500);
        })
});

router.delete('/:id', (req, res) => {
    let reqId = req.params.id;
    console.log('Delete request for id', reqId);
    let sqlText = 'DELETE FROM "list" WHERE "id"=$1;'
    pool.query(sqlText, [reqId])
        .then((result) => {
            console.log('List deleted');
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log(`Error making database query ${sqlText}`, error);
            res.sendStatus(500);
        })
})

module.exports = router; //export appropriate route to server.js