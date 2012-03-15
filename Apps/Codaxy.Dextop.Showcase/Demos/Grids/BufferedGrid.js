Ext.ns('Showcase');

Ext.define('Showcase.demos.BufferedGridWindow', {
	extend: 'Dextop.Window',
	width: 500,
	height: 300,

	title: 'Buffered Grid',
	requires: 'Ext.grid.GridPanel',

	initComponent: function () {
		var store = this.remote.createStore('model', {
			autoLoad: true,
			buffered: true,			
			pageSize: 100,
			remoteSort: true
		});

		var columns = this.remote.createGridColumns('model');

		var grid = Ext.create('Ext.grid.GridPanel', {
			border: false,
			store: store,
			columns: columns,
			disableSelection: false //it works but selection is lost on scrolling
		});

		Ext.apply(this, {
			layout: 'fit',
			items: grid
		});

		this.callParent(arguments);
	}
});
