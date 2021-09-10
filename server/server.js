const express = require('express');
const listRouter = require('./routes/list.router');

const app = express(); //create the app

app.use(express.urlencoded({ extended: true })); //use so we can use req.body when we POST
app.use(express.json()); //help translate a req into JSON format

app.use('/list', listRouter);

//find the public assets readily available to the user
app.use(express.static('server/public')); 







//establish port # and begin listening
const PORT = process.env.PORT || 5000; //eventually used for Heroku deployment
app.listen(PORT, () => {
    console.log('Running on Port:', PORT);
});