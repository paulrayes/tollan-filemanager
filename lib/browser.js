'use strict';

var Promise = require('promise');
//var assign = require('object-assign');

module.exports = {
	getAdminRoutes: function(tollan) {
		var React = tollan.React;
		var Router = tollan.Router;
		var Route = Router.Route;
		return [];
	},
	registerStores: function(tollan) {
		tollan.setStore('filemanager/fileStore', require('./stores/FileStore')(tollan));
	}
};
