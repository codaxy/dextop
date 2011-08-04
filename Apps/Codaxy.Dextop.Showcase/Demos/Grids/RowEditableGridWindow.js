Ext.ns('Showcase');

Ext.define('Showcase.demos.RowEditableGridWindow', {
	extend: 'Dextop.Window',
	width: 500,
	height: 300,

	title: 'Row Editable Grid',
	requires: 'Ext.grid.GridPanel',

	initComponent: function () {

		var store = this.remote.createStore('model', {
			autoLoad: true,
			autoSync: true,
			proxyOptions: {				
				batchActions: false,
				autoRevert: true,
				remoteCallbackOptions: {
					type: 'notify'
				}
			}
		});

		var columns = this.remote.createGridColumns('model');

		var rowEditor = new Ext.grid.plugin.RowEditing({
			//clicksToEdit: 1,
			removePhantomsOnCancel: true
		});

		var grid = Ext.create('Ext.grid.GridPanel', {
			border: false,
			store: store,
			columns: columns,
			plugins: [rowEditor],
			tbar: [{
				text: 'Add',
				iconCls: 'add',
				scope: this,
				handler: function () {
					var rec = Ext.create(store.model, {});
					rowEditor.cancelEdit();
					var index = store.getCount();
					store.insertPhantom(index, rec); //(by dextop) insert row without syncing
					rowEditor.startEdit(index, 1);
				}
			}, '-', {
				text: 'Remove',
				iconCls: 'remove',
				scope: this,
				handler: function () {
					var s = grid.getSelectionModel().getSelection();
					for (var i = 0; i < s.length; i++)
						store.remove(s[i]);
				}
			}, '-', {
				text: 'Save',
				iconCls: 'save',
				scope: this,
				handler: function () {
					store.sync();
				}
			}, {
				text: 'Refresh',
				iconCls: 'reload',
				scope: this,
				handler: function () {
					store.load();
				}
			}, '-', {
				enableToggle: true,
				pressed: true,
				text: 'Auto Save',
				listeners: {
					scope: this,
					'toggle': function (toggle, pressed) {
						store.autoSync = pressed;
					}
				}
			}, {
				enableToggle: true,
				pressed: true,
				text: 'Auto Revert',
				listeners: {
					scope: this,
					'toggle': function (toggle, pressed) {
						store.proxy.autoRevert = pressed;
					}
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
