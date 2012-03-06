Ext.ns('Dextop');

Ext.define('Dextop.Window', {
	extend: 'Ext.window.Window',

	mixins: {
		remotable: 'Dextop.remoting.Remotable'
	},

	requires: ['Ext.window.Window', 'Dextop.remoting.Remotable'],

	// property
	hasWindowState: false,
	initialWindowState: null,
		
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
	},

	// virtual
	getWindowState: function() {
		if (!this.el) // never rendered, nothing could have changed
			return this.initialWindowState
			
		// TODO When we have multiple pages, set up x, y and page index accordingly
		var state = {
			config: this.getBox(),
			instantiateOptions: this.instantiateOptions
		};

		return state;
	},

	// virtual
	restoreWindowState: function(state) {
		this.initialWindowState = state;
	}
});
