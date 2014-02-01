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

        //it's important to create columns before creating grid's store in order to load lookup stores first
	    var columns = api.createGridColumns({
	        checkEditor: true
	    });

	    var store = api.createTreeStore({
	        autoLoad: true
	    });

	    cellEditor = new Ext.grid.plugin.CellEditing({
	        clicksToEdit: 1
	    });

	    var grid = Ext.create('Ext.tree.Panel', {
	        store: store,
	        tbar: [{
	            text: 'Add',
	            scope: this,
	            handler: function () {
	                var rec = Ext.create(store.model, {});
	                store.insert(0, rec);
	                cellEditor.startEditByPosition({ row: 0, column: 1 }); //changes all the time
	            }
	        }, '-', {
	            text: 'Remove',
	            scope: this,
	            handler: function () {
	                var s = grid.getSelectionModel().getSelection();
	                for (var i = 0; i < s.length; i++)
	                    store.remove(s[i]);
	            }
	        }, '-', {
	            text: 'Save',
	            scope: this,
	            handler: function () {
	                store.sync();
	            }
	        }]
	    });

	    Ext.apply(this, {
	        layout: 'fit',
	        items: grid
	    });

	    this.callParent(arguments);
	}
});
