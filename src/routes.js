module.exports = function(app, router, passport, upload, db) {

    var fs = require('fs');
    var path = require('path');

    // you shouldn't be accessing /api/
    router.get('/', function(req, res) {
        res.redirect('..');
    });

    // /upload does not support GET
    router.get('/upload', function(req, res) {
        res.json({ message: 'Error: You must call POST on upload' });
    });

    // /upload uploads image to server, returning a url to image if successful
    router.post('/upload', upload.single('image'), function(req, res) {
        // TODO extension-only checking is unsafe, but for private use it should be ok
        if (typeof req.file == 'undefined') {
            res.json({ success: false, message: 'File rejected. Are you sure it\'s an image?' });
        }
        else { 
            var url_ = req.protocol + '://' + req.get('host');
            res.json({ success: true, url: url_ + '/api/' + req.file.filename }); 
        }
    });


    // /register an account TODO: (URGENT) password hashing, email confirmation, refactor to make this not bad code
    // plaintext password saving is absolutely horrible and i hate myself for now
    router.post('/register', function(req, res) {
        console.log("Received register request, handling...");
        if (!req.body.username || !req.body.password || !req.body.email) {
            res.json({ success: false, message: 'Missing username/password/email' });
        } else {
            db.run("INSERT INTO Accounts (username, password, email) VALUES (?,?,?)", [req.body.username, req.body.password, req.body.email], function(err) {
                if (err) { res.json({ success: false, message: "Username/Email already exists!" }); return err; }
                else { res.json({ success: true, message: 'User successfully added' }); }
            });
        }
    });

    // login to an existing account
    router.post('/login', function(req, res) {
        console.log("Received login request, handling...");
        if (!req.body.username || !req.body.password) {
            res.json({ success: false, message: 'Missing username/password' });
        } else {
            db.all("SELECT * FROM Accounts WHERE username=? AND password=?", [req.body.username, req.body.password], function(err, rows) {
                if (err) { res.json({ success: false, message: "Database error occured" }); }
                if (rows.length == 0) { res.json({ success: false, message: "Invalid username/password combination!" }); }
                else { res.json({ success: true, message: "Successfully logged in.", token: "TODO" }); }
            });
        }
    });

    // logout from an existing login
    router.post('/logout', function(req, res) {
        if (!req.body.token) {
            res.json({ success: false, message: "Not logged in." });
        } else {
            res.json({ success: true, message: "TODO" });
        }
    });

    // /image.ext, returns image if found, otherwise failure
    router.get('/:image_url', function(req, res) {
        var image_path = __dirname + '/../images/' + req.params.image_url;

        if (fs.existsSync(image_path)) {
            res.sendFile(path.join(image_path));
        } else {
            res.json({ success: false, message: "Error: File not found!"});
        }
    });

    app.use('/api', router);
}
