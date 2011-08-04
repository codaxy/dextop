//useful for stores with autosync and roweditor

Ext.override(Ext.data.Store, {
	insertPhantom: function (index, rec) {
		var autoSync = this.autoSync;
		this.autoSync = false;
		this.insert(index, rec);
		this.autoSync = autoSync;
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