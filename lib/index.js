'use strict';

var Promise = require('promise');
var assign = require('object-assign');

module.exports = assign({}, require('./browser'), {
	registerModels: function(tollan, redisClient) {
		tollan.app.use('/api/model/filemanager', require('./modelRoutes')(tollan, redisClient));
	},
	registerActions: function(tollan) {
		tollan.app.use('/api/action/filemanager', require('./actionRoutes')(tollan));
	},
	registerProjections: function(tollan, redisClient) {
		return Promise.all([
			require('./projections/files')(tollan, redisClient)
		]);
	}
});
