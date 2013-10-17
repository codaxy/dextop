Ext.ns('Showcase');

Ext.define('Showcase.demos.SwissGridWindow', {
	extend: 'Dextop.Window',
	width: 500,
	height: 300,

	title: 'Swiss Army Grid',

	initComponent: function () {

		var grid = Ext.create('Dextop.ux.SwissArmyGrid', {
			remote: this.remote,
			paging: true,
			pageSizeSelect: {
                pageSizes: [10, 50, -1]
			},
			border: false,
			editing: 'cell',
			tbar: ['add', 'edit', 'remove', '-', 'save', 'reload'],
			storeOptions: {
				pageSize: 10,
				autoLoad: true,
				autoSync: false
			},
			editingOptions: {
				clicksToEdit: 1
			}
		});

		Ext.apply(this, {
			layout: 'fit',
			items: grid
		});

		this.callParent(arguments);
	}
});
