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
	        items: {
	            xtype: 'button',
	            text: 'Invoke',
	            handler: function () {
	                this.api.HelloWorld({
	                    success: function (result) {
	                        Dextop.infoAlert(result);
	                    }
	                });
	            },
	            scope: this
	        }
	    });

	    this.callParent(arguments);
	}
});
