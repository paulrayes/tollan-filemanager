'use strict';

var Promise = require('promise');
//var assign = require('object-assign');

module.exports = function(tollan, redisClient) {
	var log = require('bunyan').createLogger({
		name: 'filemanager/projections/files'
	});

	function processUploaded(message) {
		return new Promise(function(resolve, reject) {
			redisClient.sadd('filemanager/prefixes', message.data.prefix, function(err) {
				if (err) {
					return reject(err);
				}
				redisClient.hexists('filemanager/files/' + message.data.prefix, message.data.name, function(err, exists) {
					if (err) {
						return reject(err);
					}
					redisClient.hset('filemanager/files/' + message.data.prefix, message.data.name, JSON.stringify(message.data), function(err) {
						if (err) {
							return reject(err);
						}
						if (exists === 1) {
							log.info('Replaced', message.data.prefix, message.data.name);
						} else {
							log.info('Added', message.data.prefix, message.data.name);
						}
						resolve();
					});
				});
			});
		});
	}

	return new Promise(function(resolve, reject) {
		tollan.registerProjection('filemanager/fileUploaded', 'filemanager/files', processUploaded);
		resolve();
	});
};
