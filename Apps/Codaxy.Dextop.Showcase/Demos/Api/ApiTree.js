Ext.ns('Showcase');

Ext.define('Showcase.demos.Launcher.ApiTree', {
    extend: 'Showcase.demos.Launcher',
    launch: function () {
        var remoteId = Ext.id();
        var w = Ext.create('Showcase.demos.ApiTreeWindow', {});
        w.show();        
    }
});

Ext.define('Showcase.demos.ApiTreeWindow', {
    extend: 'Ext.window.Window',	
    width: 500,
    height: 200,
    border: false,
    title: 'Tree demo using Dextop API',	
	
    initComponent: function () {

        var api = Dextop.api('tree-api');

        // It's important to create columns before creating grid's store in order to load lookup stores first
	    var columns = api.createGridColumns({
	        checkEditor: true
	    });

	    var store = api.createTreeStore({
	        autoLoad: true
	    });

	    var grid = Ext.create('Ext.tree.Panel', {
	        store: store
	    });

	    Ext.apply(this, {
	        layout: 'fit',
	        items: grid
	    });

	    this.callParent(arguments);
	}
});
