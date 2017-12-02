module.exports = function(app, router, passport, upload) {

	var fs = require('fs');
	var path = require('path');

	router.get('/', function(req, res) {
		res.redirect('..');
	});

	router.get('/upload', function(req, res) {
		res.json({ message: 'Error: You must call POST on upload' });
	});

	router.post('/upload', upload.single('image'), function(req, res) {
		// TODO: mimetype check (extension-only check is unsafe)
		console.log(req.file);
		//res.json(req.file);
		res.redirect('/api/' + req.file.filename);
	});

	router.get('/:image_url', function(req, res) {
		var image_path = __dirname + '/../images/' + req.params.image_url;

		if (fs.existsSync(image_path)) {
			res.sendFile(path.join(image_path));
		} else {
			res.json({message: "Error: File not found!"});
		}
	});

	app.use('/api', router);
}
