Ext.ns('Showcase');

Ext.define('Showcase.demos.SwissGridWithFormEditorWindow', {
	extend: 'Dextop.Window',
	width: 600,
	height: 300,

	title: 'Swiss Army Grid + Form Editor',

	initComponent: function () {

		var grid = Ext.create('Dextop.ux.SwissArmyGrid', {
			remote: this.remote,
			border: false,
			tbar: ['add', 'edit', 'remove'],
			storeOptions: {
				autoLoad: true,
				autoSync: true
			},
			editingOptions: {
				width: 350,
				formConfig: {
					bodyStyle: 'padding: 10px'
				}
			},
			editing: 'form',
			editOnDblClick: true
		});

		Ext.apply(this, {
			layout: 'fit',
			items: grid
		});

		this.callParent(arguments);
	}
});
