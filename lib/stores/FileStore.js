'use strict';

var EventEmitter = require('eventemitter3');
//var assign = require('object-assign');
//var Promise = require('promise');

module.exports = function(tollan) {
	function Store() {
		this.files = {};
		this.loaded = {};
	}
	Store.prototype.EE = new EventEmitter();//assign({}, EventEmitter.prototype);

	Store.prototype.on = function(event, fn) {
		this.EE.on(event, fn);
	};
	Store.prototype.unload = function() {
		if (this.EE.listeners('change').length === 0) {
			this.files = {};
			this.loaded = {};
		}
	};
	Store.prototype.removeListener = function(event, fn, once) {
		this.EE.removeListener(event, fn, once);
		if (this.EE.listeners('change').length === 0) {
			setTimeout(this.unload.bind(this), 5000);
		}
	};
	Store.prototype.emit = function(event, a) {
		this.EE.emit(event, a);
	};

	Store.prototype.load = function(prefix) {
		if (tollan.SERVER) {
			return;
		}
		tollan.getModel('filemanager/files/' + prefix)
			.then(items => {
				this.loaded[prefix] = Date.now();
				this.files[prefix] = items;
				this.emit('change');
			}).catch(err => {
				console.log('filemanager/FileStore loadError');
				console.log(err);
				this.emit('loadError', err);
			});
	};
	Store.prototype.getFilesByPrefix = function(prefix) {
		if (this.loaded[prefix]) {
			return this.files[prefix];
		} else {
			this.load(prefix);
			return [];
		}
	};

	return Store;
};
