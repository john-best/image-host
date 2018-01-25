module.exports  = function(app, passport) {

    var sqlite3 = require('sqlite3').verbose()
    let db = new sqlite3.Database('image-host.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) {
            console.log("Uh... some db error occurred when opening (this should not happen!)");
            console.log(err.message);
        } else {
            console.log("Database successfully accessed");
        }
    });
}