//useful for stores with autosync and roweditor
//auto revert function

Ext.override(Ext.data.Store, {

	//auto revert changes rejected by the server
	autoRevert: undefined,

	insertPhantom: function (index, rec) {
		var autoSync = this.autoSync;
		this.autoSync = false;
		this.insert(index, rec);
		this.autoSync = autoSync;
	},

	// Method for reverting changes rejected by the server.
	// It's very useful when you want that failed data reappear in the grid/store.
	revertFailedOperation: function (operation) {
		var records = operation.getRecords();
		if (records.length == 0)
			return;
		var store = this;
		switch (operation.action) {
			case "create":
				store.remove(records);
				break;
			case "update":
				for (var i = 0; i < records.length; i++)
					records[i].reject();
				break;
			case "destroy":
				store.removed = [];
				store.loadRecords(records, { addRecords: true });
				break;
		}
	},

	onBatchException: function (batch, operation) {
		var reject = this.autoRevert || this.autoReject;
		if (reject) {
			if (this.operation)
				this.revertFailedOperation(operation);
			else {
				for (var i = 0; i < batch.operations.length; i++)
					this.revertFailedOperation(batch.operations[i]);
			}
		}
	}
});

/*
* Prevents browser's context menu from appearing in the menu
*/
Ext.override(Ext.menu.Menu, {
	ignoreParentClicks: true,
	listeners: {
		'render': {
			fn: function (item) {
				var el = item.getEl();
				el.on('contextmenu', function (e) { e.preventDefault(); });
				el.on('unload', el.removeAllListeners, el);
			}
		}
	}
});

/*
* Additional rowediting events
*/

Ext.override(Ext.grid.plugin.RowEditing, {

	constructor: function (config) {
		var me = this;
		Ext.apply(me, config);
		me.addEvents(
            'beforeedit',
            'edit',
            'canceledit'
        );
		me.mixins.observable.constructor.call(me);
	},

	init: function (grid) {
		var me = this;

		me.grid = grid;
		me.view = grid.view;
		me.initEvents();
		me.initFieldAccessors(grid.headerCt.getGridColumns());
		grid.relayEvents(me, ['canceledit', 'beforeedit', 'edit']);
	},

	cancelEdit: function () {
		var me = this;

		if (this.editing) {
			this.getEditor().cancelEdit();
			this.editing = false;
			this.fireEvent('canceledit', this.context);
			if (this.removePhantomsOnCancel) {
				if (this.context.record.phantom) {
					this.context.store.remove(this.context.record);
				} else {
					this.context.record.reject()
				}
			}
		}
	}
});