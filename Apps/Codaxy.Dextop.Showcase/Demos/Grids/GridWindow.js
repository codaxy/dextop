Ext.ns('Showcase');

Ext.define('Showcase.demos.GridWindow', {
	extend: 'Dextop.Window',
	width: 500,
	height: 300,

	title: 'Grid Window',
	requires: 'Ext.grid.GridPanel',

	initComponent: function () {
		var store = this.remote.createStore('model', {
			autoLoad: true
		});

		var columns = this.remote.createGridColumns('model');

		var grid = Ext.create('Ext.grid.GridPanel', {
			border: false,
			store: store,
			columns: columns
		});

		Ext.apply(this, {
			layout: 'fit',
			items: grid
		});

		this.callParent(arguments);
	}
});
