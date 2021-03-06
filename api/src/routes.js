module.exports = function (app, router, upload, jwt_secret) {

    var fs = require('fs');
    var path = require('path');
    var bcrypt = require('bcrypt');
    var jwt = require('jsonwebtoken');
    var db = require('./db');

    // you shouldn't be accessing /api/
    router.get('/', function (req, res) {
        res.redirect('..');
    });

    // /upload does not support GET
    router.get('/upload', function (req, res) {
        res.json({ message: 'Error: You must call POST on upload' });
    });

    // update token if possible, otherwise let the user know that their session has expired
    router.post('/update', function (req, res) {
        if (req.user) {
            db.all("SELECT username, email, id FROM Accounts WHERE username=?", [req.user.username], function (err, rows) {
                if (err) { res.json({ success: false, message: "Database error occured" }); }
                if (rows.length == 0) { res.json({ success: false, message: "Something horrible has happened..." }); }
                else {
                    res.json({
                        success: true, message: 'Token updated',
                        token: jwt.sign({ username: rows[0].username, email: rows[0].email, id: rows[0].id }, jwt_secret, { expiresIn: '1h' })
                    });
                }
            });
        } else {
            res.json({ success: false, message: 'Token has expired. Please login to get a new token.' })
        }
    });

    // /upload uploads image to server, returning a url to image if successful

    var multer_upload = upload.single('image')
    router.post('/upload', function (req, res) {
        // TODO extension-only checking is unsafe, but for private use it should be ok
        multer_upload(req, res, function (err) {
            // catch uploading errors (file size too big, etc.)
            if (err) {
                res.json({ success: false, message: "File too large (probably)! Otherwise, something internal went wrong..." });
                return;
            }

            if (req.user) {
                var _userid = "";
                db.all("SELECT id FROM Accounts WHERE username=(?)", [req.user.username], function (err, rows) {
                    if (err) { res.json({ success: false, message: 'database error has occured.' }); return; }
                    else if (rows.length == 0) { res.json({ success: false, message: 'user does not exist.' }); return; }
                    _userid = rows[0].id;

                    console.log("Received upload request from user " + req.user.username + ", id: " + _userid + ", handling...");
                    if (typeof req.file == 'undefined') {
                        res.json({ success: false, message: 'File rejected. Are you sure it\'s an image?' });
                        return;
                    }
                    else {
                        db.run("INSERT INTO Images (filename, userid, upload_date) VALUES (?,?, datetime('now'))", [req.file.filename, _userid]);
                        var url_ = req.protocol + '://' + req.get('host');
                        res.json({ success: true, url: url_ + '/api/' + req.file.filename, filename: req.file.filename, username: req.user.username, userid: _userid });
                        return;
                    }
                });

            } else {
                res.json({ success: false, message: 'User not authorized to upload-- are you logged in?' });
                return;
            }
        })
    });


    // /register an account TODO: email confirmation, refactor to make this not bad code
    router.post('/register', function (req, res) {
        console.log("Received register request, handling...");
        if (!req.body.username || !req.body.password || !req.body.email) {
            res.json({ success: false, message: 'Missing username/password/email' });
        } else {
            bcrypt.hash(req.body.password, 5, function (berr, hash) {
                db.run("INSERT INTO Accounts (username, password, email, register_date) VALUES (?,?,?,datetime('now'))", [req.body.username, hash, req.body.email], function (err) {
                    if (err) { res.json({ success: false, message: "Username/Email already exists!" }); return err; }
                    else {
                        db.all("SELECT username, email, id FROM Accounts WHERE username=?", [req.body.username], function (err, rows) {
                            if (err) { res.json({ success: false, message: "Database error occured" }); }
                            if (rows.length == 0) { res.json({ success: false, message: "Something horrible has happened..." }); }
                            else {
                                res.json({
                                    success: true, message: 'User successfully added',
                                    token: jwt.sign({ username: rows[0].username, email: rows[0].email, id: rows[0].id }, jwt_secret, { expiresIn: '1h' })
                                });
                            }
                        })
                    }
                });
            });
        }
    });

    // login to an existing account
    // jwt expires every so often so this should only be used for web applications
    // native applications and mobile applications probably need a spearate login system with database entries for keys (to deauthorize)
    router.post('/login', function (req, res) {
        console.log("Received login request, handling...");
        if (!req.body.username || !req.body.password) {
            res.json({ success: false, message: 'Missing username/password' });
        } else {
            db.all("SELECT * FROM Accounts WHERE username=?", [req.body.username], function (err, rows) {
                if (err) { res.json({ success: false, message: "Database error occured" }); }
                if (rows.length == 0) { res.json({ success: false, message: "Invalid username/password combination!" }); }
                else {
                    bcrypt.compare(req.body.password, rows[0].password, function (berr, bres) {
                        if (bres == true) {
                            res.json({
                                success: true,
                                message: "Successfully logged in.",
                                token: jwt.sign({ username: rows[0].username, email: rows[0].email, id: rows[0].id }, jwt_secret, { expiresIn: '1h' })
                            });
                        } else {
                            res.json({ success: false, message: "Invalid username/password combination!" });
                        }
                    });
                }
            });
        }
    });

    // logout from an existing login
    router.post('/logout', function (req, res) {
        if (!req.token) {
            res.json({ success: false, message: "Not logged in." });
        } else {
            // TODO: delete token from database
            res.json({ success: partial, message: "TODO" });
        }
    });

    router.get('/profile/:username', function (req, res) {
        db.all("SELECT id FROM Accounts WHERE username=(?)", [req.params.username], function (err, rows) {
            if (err) { res.json({ success: false, message: "db error has occured" }); }
            if (rows.length == 0) { res.json({ success: false, message: "no user found!" }); }
            else {
                var _userid = rows[0].id;
                db.all("SELECT filename, upload_date FROM Images where userid=(?) ORDER BY upload_date DESC", [_userid], function (err, rows) {
                    if (err) { res.json({ success: false, message: "db error has occured" }); }
                    if (rows.length == 0) { res.json({ success: true, images: [] }); }
                    else {
                        images = []
                        rows.forEach(function (item) {
                            images.push(item);
                        });
                        res.json({ success: true, images: images });
                    }
                });
            }
        });
    });

    router.get('/get_user', function (req, res) {
        if (req.user) {
            return res.json({ success: true, username: req.user.username });
        } else {
            return res.json({ success: false, message: "You must be logged in to get username!" });
        }
    });


    router.get('/get_image_info/:filename', function (req, res) {
        var temp_filename = req.params.filename;
        db.all("SELECT * FROM Images WHERE filename=(?)", [temp_filename], function (err, rows_images) {
            if (err) { res.json({ success: false, message: "db error has occured" }); }
            if (rows_images.length == 0) { res.json({ success: false, message: "No such file exists!" }); }
            else {
                db.all("SELECT * FROM Accounts WHERE id=(?)", [rows_images[0].userid], function (err_2, rows_accounts) {
                    if (err) { res.json({ success: false, message: "db error has occured" }); }
                    if (rows_accounts.length == 0) { res.json({ success: false, message: "No such user exists... somehow!" }); }
                    else {
                        return res.json({ success: true, filename: temp_filename, uploaded_by: rows_accounts[0].username, upload_date: rows_images[0].upload_date });
                    }
                })
            }
        })

    });

    // /image.ext, returns image if found, otherwise failure
    router.get('/:image_url', function (req, res) {
        var image_path = __dirname + '/../images/' + req.params.image_url;

        if (fs.existsSync(image_path)) {
            res.sendFile(path.join(image_path));
        } else {
            res.status(404).send('Image not found!');
        }
    });

    app.use('/api', router);
}
