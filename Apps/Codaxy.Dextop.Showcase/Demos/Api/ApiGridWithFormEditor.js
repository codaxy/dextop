Ext.ns('Showcase');

Ext.define('Showcase.demos.Launcher.ApiGridWithFormEditor', {
    extend: 'Showcase.demos.Launcher',
    launch: function () {
        var remoteId = Ext.id();
        var w = Ext.create('Showcase.demos.ApiGridWithFormEditor', {});
        w.show();        
    }
});

Ext.define('Showcase.demos.ApiGridWithFormEditor', {
    extend: 'Ext.window.Window',	
    width: 500,
    height: 200,
    border: false,
    title: 'Grid demo using Dextop API and swiss army grid with form editor',	
	
    initComponent: function () {

	    var grid = Ext.widget('swissarmygrid', {
	        api: 'api-grid-form',
            editing: 'form',
	        tbar: ['add', 'edit', 'remove'],
	        storeOptions: {
	            autoLoad: true,
                autoSync: true
	        }
	    });

	    Ext.apply(this, {
	        layout: 'fit',
	        items: grid
	    });

	    this.callParent(arguments);
	}
});
