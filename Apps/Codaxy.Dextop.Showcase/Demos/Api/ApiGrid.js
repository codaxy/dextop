Ext.ns('Showcase');

Ext.define('Showcase.demos.Launcher.ApiGrid', {
    extend: 'Showcase.demos.Launcher',
    launch: function () {
        var remoteId = Ext.id();
        var w = Ext.create('Showcase.demos.ApiGridWindow', {});
        w.show();        
    }
});

Ext.define('Showcase.demos.ApiGridWindow', {
    extend: 'Ext.window.Window',	
    width: 500,
    height: 200,
    border: false,
    title: 'Grid demo using Dextop API',	
	
    initComponent: function () {

        var api = Ext.create('Showcase.demos.ApiGrid', {});

        //it's important to create columns before creating grid's store in order to load lookup stores first
	    var columns = api.createGridColumns({
	        checkEditor: true
	    });

	    var store = api.createStore({
	        autoLoad: true
	    });

	    cellEditor = new Ext.grid.plugin.CellEditing({
	        clicksToEdit: 1
	    });

	    var grid = Ext.create('Ext.grid.GridPanel', {
	        store: store,
	        columns: columns,
	        plugins: [cellEditor],
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
