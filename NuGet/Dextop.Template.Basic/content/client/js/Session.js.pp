Ext.ns('$rootnamespace$');


Ext.define('$rootnamespace$.Session', {

	extend: 'Dextop.Session',

	initSession: function () {
		this.callParent(arguments);
        
        /*
        this.viewport = Ext.create('Showcase.DemoViewport', {
			store: demoStore,
			session: this,
			renderTo: Ext.getBody()
		});
        */

		this.remote.CreateSimpleWindow({
		    success : function(config) {
		        var win = Dextop.create(config);
		        win.show();
		    }
		});
	}
});