Ext.ns('Showcase');

Ext.define('Showcase.demos.Launcher.FirstApiDemo', {
    extend: 'Showcase.demos.Launcher',
    launch: function () {
        var remoteId = Ext.id();
        var w = Ext.create('Showcase.demos.FirstApiDemoWindow', {});
        w.show();        
    }
});

Ext.define('Showcase.demos.FirstApiDemoWindow', {
	extend: 'Ext.window.Window',	
	width: 300,
	height: 200,
	
	title: 'Dextop API demo',	
	
	initComponent: function () {

	    this.api = Ext.create('Showcase.demos.FirstApiDemo', {

	    });

	    Ext.apply(this, {
            bodyPadding: 10,
	        items: [{
	            xtype: 'button',
	            text: 'Invoke',
	            handler: function () {
	                this.api.Hello({
	                    success: function (result) {
	                        Dextop.infoAlert(result);
	                    }
	                });
	            },
	            scope: this
	        }, {
	            xtype: 'button',
	            text: 'Info',
	            handler: function () {
	                this.api.Info({});
	            },
	            scope: this
	        }, {
	            xtype: 'button',
	            text: 'Error',
	            handler: function () {
	                this.api.Error({});
	            },
	            scope: this
	        }]
	    });

	    this.callParent(arguments);
	}
});
