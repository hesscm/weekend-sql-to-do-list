const express = require('express'); //bring in express
const router = express.Router(); //establish router method

const moment = require('moment'); //declare moment function as a variable
moment.locale('en'); //force time to appear in english format

//bring in pool to allow connection to database
const pool = require('../modules/pool'); 

//get table from database or display an error
router.get('/', (req, res) => {
    let queryText = 'SELECT * FROM "list" ORDER BY "id" DESC;'; //query to send to the databse
    pool.query(queryText).then(result => {
        // Sends back the results in an object
        console.log('in Server GET');
        //change the time format to a more readable version
        for (let i = 0; i < result.rows.length; i++) { //loop through list
            if (result.rows[i].timeCompleted !=null) { //if time exists...
                result.rows[i].timeCompleted = //adjust time format
                    moment(result.rows[i].timeCompleted)
                    .add(12, 'hours') //had issues showing wrong AM/PM, this adjusts for that
                    .format('MMM Do YY, h:mm a') //Sep 12th 21, 2:24 pm/am
            }
        }
        res.status(200).send(result.rows); //send list
    })
        .catch(error => {
            console.log('error getting books', error);
            res.sendStatus(500); //throw error
        });
});

//add a new list item to the database
router.post('/', (req, res) => {
    let newListItem = req.body;
    console.log(`Adding item`, newListItem);

    let queryText = `INSERT INTO "list" ("note", "category", "priority")
                                 VALUES ($1, $2, $3);`;
    pool.query(queryText, [newListItem.note, newListItem.category, newListItem.priority])
        .then(result => {
            res.sendStatus(201); //send Created
        })
        .catch(error => {
            console.log(`Error adding new list item.`, error);
            res.sendStatus(500); //throw error
        });
});

//toggle from is complete to is NOT complete and vice versa
router.put('/:id', (req, res) => {
    //variable to track current time
    let currentTime = moment().format("YYYY-MM-DD h:mm:ss");
    console.log('currentTime: ', currentTime);
    let reqId = req.params.id; //find id from request
    let sqlText = '';
    console.log('Put request for id', reqId);
    //if item IS complete, set to false and remove time completed
    if (req.body.isComplete === 'true') { 
        sqlText = 'UPDATE "list" SET "isComplete" = false, "timeCompleted" = null WHERE "id" = $1;'
    }
    //if item is NOT complete, set complete and enter the current time
    else {
        sqlText = `UPDATE "list" SET "isComplete" = true, "timeCompleted" = '${currentTime}' WHERE "id" = $1;`
    }
    pool.query(sqlText, [reqId]) //send query to db
        .then((result) => {
            console.log('List updated');
            res.sendStatus(201); //send Created
        })
        .catch((error) => {
            console.log(`Error making database query ${sqlText}`, error);
            res.sendStatus(500); //throw error
        })
});

//delete a list item from the database
router.delete('/:id', (req, res) => {
    let reqId = req.params.id;
    console.log('Delete request for id', reqId);
    let sqlText = 'DELETE FROM "list" WHERE "id"=$1;'
    pool.query(sqlText, [reqId]) //send query to db
        .then((result) => {
            console.log('List deleted');
            res.sendStatus(200); //send Ok
        })
        .catch((error) => {
            console.log(`Error making database query ${sqlText}`, error);
            res.sendStatus(500); //throw error
        })
})

//POST for sort option so we can transfer data from client to server
//sorts the return based on user request
router.post('/sort', (req, res) => {
    //identify allowed sorting options
    let sortOptions = ["id", "priority", "category", "isComplete", "timeCompleted", "reversed"];
    let option = '"id" DESC;'; //id by default so program doesn't break
    console.log("server sort get", req.body.option);
    //loop through sortOptions and try and find match to the request
    for (let i = 0; i < sortOptions.length; i++) {
        //reversed does not exist in the database so check this specifically
        if (req.body.option === sortOptions[5]) {
            option = '"id" ASC;'; //order by id in a ascending order
        } else if (req.body.option === sortOptions[0]) {
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

module.exports = router; //export appropriate route to server.js