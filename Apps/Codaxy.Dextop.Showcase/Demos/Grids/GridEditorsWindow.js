Ext.ns('Showcase');

Ext.define('Showcase.demos.GridEditorsWindow', {
	extend: 'Dextop.Window',
	width: 700,
	height: 300,

	title: 'All Grid Editors',
	requires: 'Ext.grid.GridPanel',

	initComponent: function () {

		var store = this.remote.createStore('model', {
			autoLoad: true,
			autoSync: true
		});

		var columns = this.remote.createGridColumns('model', {
			remote: this.remote,
			checkEditor: false
		});

		var rowEditor = new Ext.grid.plugin.RowEditing({
			clicksToEdit: 1,
			removePhantomsOnCancel: true
		})

		var grid = Ext.create('Ext.grid.GridPanel', {
			store: store,
			columns: columns,
			plugins: [rowEditor],
			border: false,
			tbar: [{
				text: 'Add',
				scope: this,
				handler: function () {
					var rec = Ext.create(store.model, {});
					store.insertPhantom(0, rec);
					rowEditor.startEdit(0, 0);
				}
			}, '-', {
				text: 'Remove',
				scope: this,
				handler: function () {
					var s = grid.getSelectionModel().getSelection();
					for (var i = 0; i < s.length; i++)
						store.remove(s[i]);
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
