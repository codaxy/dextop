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

Ext.override(Ext.form.field.ComboBox, {
	setValue: function (value, doSelect) {
		var me = this,
            valueNotFoundText = me.valueNotFoundText,
            inputEl = me.inputEl,
            i, len, record,
            models = [],
            displayTplData = [],
            processedValue = [];

		if (me.store.loading) {
			// Called while the Store is loading. Ensure it is processed by the onLoad method.
			me.value = value;
			me.setHiddenValue(me.value);
			return me;
		}

		// This method processes multi-values, so ensure value is an array.
		value = Ext.Array.from(value);

		// Loop through values
		for (i = 0, len = value.length; i < len; i++) {
			record = value[i];
			if (!record || !record.isModel) {
				record = me.findRecordByValue(record);
			}
			// record found, select it.
			if (record) {
				models.push(record);
				displayTplData.push(record.data);
				processedValue.push(record.get(me.valueField));
			}
			// record was not found, this could happen because
			// store is not loaded or they set a value not in the store
			else {
				// If we are allowing insertion of values not represented in the Store, then set the value, and the display value
				if (!me.forceSelection) {
					displayTplData.push(value[i]);
					processedValue.push(value[i]);
				}
				// Else, if valueNotFoundText is defined, display it, otherwise display nothing for this value
				else if (Ext.isDefined(valueNotFoundText)) {
					displayTplData.push(valueNotFoundText);
					processedValue.push(value[i]); ///!!!!!!!!!!!!!!!! Added line required for RemoteLookupCombos and valueNotFoundText scenario !!!!!!!!!!!
				}
			}
		}

		// Set the value of this field. If we are multiselecting, then that is an array.
		me.setHiddenValue(processedValue);
		me.value = me.multiSelect ? processedValue : processedValue[0];
		if (!Ext.isDefined(me.value)) {
			me.value = null;
		}
		me.displayTplData = displayTplData; //store for getDisplayValue method
		me.lastSelection = me.valueModels = models;

		if (inputEl && me.emptyText && !Ext.isEmpty(value)) {
			inputEl.removeCls(me.emptyCls);
		}

		// Calculate raw value from the collection of Model data
		me.setRawValue(me.getDisplayValue());
		me.checkChange();

		if (doSelect !== false) {
			me.syncSelection();
		}
		me.applyEmptyText();

		return me;
	}
});

if (Ext.versions.extjs.version < '4.1.1')
	Ext.override(Ext.grid.header.Container, {

		afterRender: function () {
			var me = this;

			this.callParent();

			var store = this.up('[store]').store,
            sorters = store.sorters,
            first = sorters.first(),
            hd;

			if (first) {
				hd = this.down('gridcolumn[dataIndex=' + first.property + ']');
				if (hd) {
					hd.setSortState(first.direction, false, true);
				}
			}

			this.tip = Ext.create('Ext.tip.ToolTip', {
				target: this.el,
				delegate: ".x-column-header",
				trackMouse: true,
				renderTo: Ext.getBody(),
				listeners: {
					beforeshow: function (tip) {
						var c = me.down('gridcolumn[id=' + tip.triggerElement.id + ']');
						if (c && c.tooltip)
							tip.update(c.tooltip);
						else
							return false;
					}
				}
			});
		}
	});

Ext.data.Types.TIMESTAMP = {
    convert: function (v, data) {
        if (v && Ext.isString(v)) {
            return Ext.Date.parse(v, 'H:i');
        }
        return v;
    },
    sortType: function (v) {
        return v;
    },
    type: 'Timestamp'
};