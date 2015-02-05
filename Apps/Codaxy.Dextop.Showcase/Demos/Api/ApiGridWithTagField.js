Ext.ns('Showcase');

Ext.define('Showcase.demos.Launcher.ApiGridWithTagField', {
    extend: 'Showcase.demos.Launcher',
    launch: function () {
        var remoteId = Ext.id();
        var w = Ext.create('Showcase.demos.ApiGridWithTagField', {});
        w.show();        
    }
});

Ext.define('Showcase.demos.ApiGridWithTagField', {
    extend: 'Ext.window.Window',	
    width: 500,
    height: 300,
    border: false,
    title: 'SwissArmyGrid with tag field demo using Dextop API',	
	
    initComponent: function () {
	    Ext.apply(this, {
	        layout: 'fit',
	        items: [{
	            xtype: 'swissarmygrid',
	            api: 'people-grid',
	            editing: 'form',
	            tbar: ['add', 'edit', 'remove'],
	            storeOptions: {
	                autoLoad: true,
                    autoSync: true
	            }
	        }]
	    });

	    this.callParent(arguments);
	}
});
