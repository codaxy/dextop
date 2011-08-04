Ext.ns('Showcase');

Ext.define('Showcase.demos.GridActionsWindow', {
	extend: 'Dextop.Window',
	width: 500,
	height: 300,

	title: 'Grid Action Manager',
	requires: 'Ext.grid.GridPanel',

	initComponent: function () {

		var store = this.remote.createStore('model', {
			autoLoad: true,
			autoSync: true
		});

		var columns = this.remote.createGridColumns('model');

		var rowEditor = new Ext.grid.plugin.RowEditing({
			clicksToEdit: 2,
			removePhantomsOnCancel: true
		});

		var actionsPlugin = new Ext.ux.grid.plugin.ActionManager({
			actions: [{
				text: 'Add',
				key: [Ext.EventObject.NUM_PLUS, Ext.EventObject.INSERT],
				scope: this,
				handler: function () {
					var rec = Ext.create(store.model, {});
					rowEditor.cancelEdit();
					var index = store.getCount();
					store.insertPhantom(index, rec);
					rowEditor.startEdit(index, 1);
				}
			}, '-', {
				text: 'Edit',
				enableOnSingle: true,
				scope: this,
				handler: function () {
					var rec = rowEditor.grid.getSelectionModel().getSelection()[0];
					rowEditor.cancelEdit();
					rowEditor.startEdit(store.indexOf(rec), 1);
				}
			}, '-', {
				text: 'Remove',
				key: [Ext.EventObject.NUM_MINUS, Ext.EventObject.DELETE],
				enableOnSingle: function (rec) {
					return !rec.get('IsAdministrator');
				},
				scope: this,
				handler: function () {
					rowEditor.cancelEdit();
					var s = grid.getSelectionModel().getSelection();
					for (var i = 0; i < s.length; i++)
						store.remove(s[i]);
				}
			}],
			contextMenuConfig: {
				showSeparator: false
			}
		});

		var grid = Ext.create('Ext.grid.GridPanel', {
			store: store,
			columns: columns,
			border: false,
			plugins: [rowEditor, actionsPlugin],
			bbar: actionsPlugin.getActions()
		});

		Ext.apply(this, {
			layout: 'fit',
			items: grid
		});

		this.callParent(arguments);

	}
});
