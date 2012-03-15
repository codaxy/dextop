Ext.ns('Dextop');

Ext.define('Dextop.Window', {
	extend: 'Ext.window.Window',

	mixins: {
		remotable: 'Dextop.remoting.Remotable'
	},

	requires: ['Ext.window.Window', 'Dextop.remoting.Remotable'],

	initialWindowState: null,
	
	// set by Session.instantiate
	instantiateOptions: null,
		
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
		if (!this.el) {
			// never rendered, nothing could have changed
			return this.initialWindowState
		}
			
		var state = {
			// This will be passed as remote instantiation config parameter
			config: this.getBox(),
			// This will be used to instantiate remote object
			instantiateOptions: this.instantiateOptions
		};

		return state;
	},

	// virtual
	restoreWindowState: function(state) {
		this.initialWindowState = state;
	}
});
