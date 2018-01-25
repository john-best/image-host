module.exports = function(app, router, passport, upload) {

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


    // /register an account TODO: database/auth
    router.post('/register', function(req, res) {
        if (!req.body.username || !req.body.password) {
            res.json({ success: false, message: 'Missing username/password' });
        } else {
            res.json({ message: 'TODO' });
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
