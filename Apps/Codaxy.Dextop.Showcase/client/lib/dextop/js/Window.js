Ext.ns('Dextop');

Ext.define('Dextop.Window', {

	extend: 'Ext.window.Window',

	mixins: {
		remotable: 'Dextop.remoting.Remotable'
	},

	requires: ['Ext.window.Window', 'Dextop.remoting.Remotable'],

	constructor: function (config) {

		if (config.remote) {
			this.initRemote(config.remote);
			delete config.remote;
		}

		this.callParent(arguments);
	},

	destroy: function () {
		try {
			this.remote.Dispose();
		} catch (e) { }
		this.destroyRemote();
		this.callParent(arguments);
	}
});
