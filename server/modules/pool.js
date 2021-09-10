const pg = require('pg');

//for mac with homebrew and postico
// const config = {
//     database: 'weekend-to-do-app',
//     host: 'localhost',
//     port: 5432,
//     max: 10,
//     idleTimeoutMillis: 30000
// };

//for windows with pgAdmin4
const config = {
    user: 'postgres', // Add db user
    host: 'localhost',
    database: 'weekend-to-do-app', // Add db name
    password: '1211', // Add db password
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000
};

//mac users
const pool = new pg.Pool(config);

pool.on("connect", () => {
    console.log("connected to postgres");
});

pool.on("error", (error) => {
    console.log("error connecting to postgres", error);
});

module.exports = pool;