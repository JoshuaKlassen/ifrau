'use strict';

var inherits = require('inherits'),
	Promise = require('lie');

var Port = require('./port'),
	resizer = require('./plugins/iframe-resizer/client'),
	syncLang = require('./plugins/sync-lang/client'),
	syncTitle = require('./plugins/sync-title/client'),
	syncFont = require('./plugins/sync-font/client');

function Client(options) {
	if (!(this instanceof Client)) {
		return new Client(options);
	}

	options = options || {};

	Port.call(this, window.parent, '*', options);

	if (options.syncLang) {
		this.use(syncLang);
	}
	if (options.syncTitle !== false) {
		this.use(syncTitle);
	}
	if (options.syncFont) {
		this.use(syncFont);
	}
	if (options.resizeFrame !== false) {
		this.use(resizer);
	}
}
inherits(Client, Port);

Client.prototype.connect = function connect() {
	var me = this;

	return new Promise(function(resolve/*, reject*/) {
		me.open();
		me._sendMessage('evt', 'ready');

		Port.prototype.connect.call(me);

		resolve(me);
	});
};

module.exports = Client;
