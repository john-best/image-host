
var sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('image-host.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.log("Uh... some db error occurred when opening (this should not happen!)");
        console.log(err.message);
    } else {
        console.log("Database successfully accessed");
    }
});


db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS Accounts ( \
        id INTEGER PRIMARY KEY, \
        username TEXT NOT NULL UNIQUE, \
        password TEXT NOT NULL, \
        email TEXT NOT NULL UNIQUE)");
});


module.exports = db;
