'use strict';

var fs = require('fs');
var multer = require('multer');
var mv = require('mv');

module.exports = function(tollan) {
	var router = tollan.express.Router();
	var log = require('bunyan').createLogger({
		name: 'filemanager/actions'
	});

	router.use(multer({
		dest: tollan.dataDirectory,
		putSingleFilesInArray: true,
		/*changeDest: function(dest, req, res) {
			return dest + '/' + req.body.prefix;
		},*/
		rename: function(fieldname, filename, req, res) {
			return filename + '-' + Date.now();
		},
		onFileUploadStart: function(file) {
			log.info('Beginning upload of "' + file.originalname + '"');
		},
		onFileUploadComplete: function(file) {
			log.info('Completed upload of "' + file.originalname + '"');
		}
	}));
	router.post('/upload', function(req, res) {
		//console.log(req.files);
		var movedCount = 0;
		var file = req.files.file[0];
		//console.log(file);process.exit();
		var path = tollan.dataDirectory + '/' + req.body.prefix + '/' + file.name;
		mv(file.path, path, {mkdirp: true}, (err) => {
			if (err) {
				res.status(500).send(err.code);
				throw(err);
			}
			tollan.saveEvent('filemanager/fileUploaded', {
				prefix: req.body.prefix,
				name: file.originalname,
				path: path
			}).then((index) => {
				res.send('ok');
			}).catch((err) => {
				res.status(500).send(err.code);
				throw(err);
			});
		});
	});

	return router;
};
