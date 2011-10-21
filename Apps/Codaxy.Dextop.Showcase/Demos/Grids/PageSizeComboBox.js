Ext.ns('Showcase');

Ext.define('Showcase.demos.PageSizeComboBoxWindow', {
    extend: 'Dextop.Window',
    width: 600,
    height: 400,
	maximizable: true,

	title: 'Page Size Combo',
    requires: 'Ext.grid.GridPanel',

    initComponent: function () {

        var store = this.remote.createStore('model', {
            pageSize: 10,
            autoLoad: false,
            remoteSort: true
        });

        var columns = this.remote.createGridColumns('model');

        var grid = Ext.create('Ext.grid.GridPanel', {
            store: store,
            columns: columns,
			border: false,
            bbar: new Ext.PagingToolbar({
                store: store,
                displayInfo: true,
                displayMsg: 'Displaying items {0} - {1} of {2}',
                emptyMsg: "No items to display",
				items: ['Page: ', {
					xtype: 'pagesizecombo',
					store: store
				}]
            })
        });

        Ext.apply(this, {
            layout: 'fit',
            items: grid
        });

        store.loadPage(1);

        this.callParent(arguments);

    }
});
