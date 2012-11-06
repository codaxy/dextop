Ext.ns('Showcase');

Ext.define('Showcase.demos.JsonGridWindow', {
	extend: 'Dextop.Window',
	width: 600,
	height: 300,

	title: 'Editable Grid',
	requires: 'Ext.grid.GridPanel',

	initComponent: function () {

		var store = this.remote.createStore('model', {
			autoLoad: true
		});

		var columns = this.remote.createGridColumns('model', {
			checkEditor: true
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
