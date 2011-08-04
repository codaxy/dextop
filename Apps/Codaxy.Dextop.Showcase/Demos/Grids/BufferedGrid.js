Ext.ns('Showcase');

Ext.define('Showcase.demos.BufferedGridWindow', {
	extend: 'Dextop.Window',
	width: 500,
	height: 300,

	title: 'Buffered Grid',
	requires: 'Ext.grid.GridPanel',

	initComponent: function () {
		var store = this.remote.createStore('model', {
			autoLoad: false,
			buffered: true,			
			pageSize: 100,
			remoteSort: true
		});

		var columns = this.remote.createGridColumns('model');

		var grid = Ext.create('Ext.grid.GridPanel', {
			border: false,
			store: store,
			columns: columns,
			verticalScroller: {
				xtype: 'paginggridscroller'
			},
			disableSelection: true,
			invalidateScrollerOnRefresh: false
		});

		Ext.apply(this, {
			layout: 'fit',
			items: grid
		});

		store.guaranteeRange(0, store.pageSize-1);

		this.callParent(arguments);
	}
});
