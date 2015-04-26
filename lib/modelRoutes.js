'use strict';


module.exports = function(tollan, redisClient) {
	var router = tollan.express.Router();

	router.get('/prefixes', function(req, res) {
		redisClient.smembers('filemanager/prefixes', function(err, items) {
			if (err) {
				return res.status(500).json({});
			}
			return res.json(items);
		});
	});

	router.get(/^\/files\/(.+)$/i, function(req, res) {
		redisClient.hgetall('filemanager/files/' + req.params[0], function(err, items) {
			if (err) {
				return res.status(500).json({});
			}
			var result = [];
			for (var id in items) {
				result.push(JSON.parse(items[id]));
			}
			return res.json(result);
		});
	});

	return router;
};
