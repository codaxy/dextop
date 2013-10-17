Ext.define('Dextop.ux.SwissArmyGrid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.swissarmygrid',

	model: 'model', //Common name of store and column model as registered on the server side.
	addText: 'Add Record',
	editText: 'Edit Record',

	editing: undefined, //One of the 'cell', 'row', 'form'	 
	editingOptions: undefined, //special options to be passed to the editing plugin

	storeName: undefined, //Name of the store component. If not specified model property is used. 
	storeOptions: undefined, //Special store configuration options

	columnModelName: undefined, //Name of the column model, 
	columnModelOptions: undefined, //Special column model options (e.g. renderers, etc.)

	paging: false, //Set to true to enable paging.
	pagingToolbarOptions: undefined, //Special paging toolbar options       

	actionIconClsSuffix: undefined, //Suffix to be added to the action name to get the action icon class (e.g. '-icon' will transform 'add' to 'add-icon')
	actionIconClsPrefix: undefined, //Suffix to be added to the action name to get the action icon class (e.g. 'icon-' will transform 'add' to 'icon-add')

	editOnDblClick: false, //Start editing when row is double-clicked	

	confirmDeleteText: 'Are you sure you want to remove the selected records?',
	pageSizeText: 'Size: ',
	pageSizeSelect: false, //add page size combo to paging toolbar
    pageSizeSelectOptions: undefined, //Additional options for page size plugin

	defaultRowEditingOptions: {
		removePhantomsOnCancel: true
	},

	autoSelect: true, //use AutoSelect plugin, use autoSelect: {...} to configure plugin

	initComponent: function () {

		//if (!this.remote)
	    //	throw 'Swiss grid panel requires remote object to be configured.';

	    if (this.api)
	        this.api = Dextop.api(this.api);

	    if (!this.store) {
	        if (this.remote)
	            this.store = this.remote.createStore(this.storeName || this.model, this.storeOptions);
	        else if (this.api)
	            this.store = this.api.createStore(this.storeOptions);
	        else
	            throw 'Swiss army grid store could not be resolved. No api nor remote object is specified.';

			delete this.storeOptions;
		}

		this.addEvents('newrecord');

		this.columnModelOptions = this.columnModelOptions || {};
		Ext.apply(this.columnModelOptions, {
			remote: this.remote,
			checkEditor: this.editing == 'cell'
		});

		if (!this.columns) {
            if (this.remote)
                this.columns = this.remote.createGridColumns(this.columnModelName || this.model, this.columnModelOptions);
            else if (this.api)
                this.columns = this.api.createGridColumns(this.columnModelOptions);
            else
                throw 'Swiss army grid columns could not be resolved. No api nor remote object is specified.';
		    delete this.columnModelOptions;
		}

		this.actionManager = Ext.create('Ext.ux.grid.plugin.ActionManager');
		this.plugins = Ext.Array.from(this.plugins) || [];
		this.plugins.push(this.actionManager);

		if (this.autoSelect) {
			var as = this.autoSelect === true ? {} : this.autoSelect;
			this.plugins.push(Ext.create('Ext.ux.grid.plugin.AutoSelect', as));
			this.autoSelect = as;
		}

		if (this.paging) {
			if (this.bbar)
				throw 'Grid does not support paging and bbar. Use them exclusively.';
			this.pagingToolbarOptions = this.pagingToolbarOptions || {};
			this.pagingToolbarOptions.items = Ext.Array.from(this.pagingToolbarOptions.items) || [];
			if (this.pageSizeSelect) {
			    var options = Ext.apply({}, this.pageSizeSelectOptions);
			    if (typeof this.pageSizeSelect == 'object')
			        Ext.apply(options, this.pageSizeSelect);

				this.pagingToolbarOptions.items.push('-', this.pageSizeText, Ext.apply({
					xtype: 'pagesizecombo',
					store: this.store
				}, options));
			}
			this.bbar = Ext.create('Ext.PagingToolbar', Ext.apply({
				store: this.store
			}, this.pagingToolbarOptions));
		}

		this.createEditingPlugin();

		if (Ext.isArray(this.tbar))
			this.tbar = this.actionManager.add(this.convertStringActions(this.tbar));

		if (Ext.isArray(this.bbar))
			this.bbar = this.actionManager.add(this.convertStringActions(this.bbar));

		this.callParent();

		if (this.editOnDblClick) {
		    this.mon(this, 'itemdblclick', function () {
		        this.editRecord();
		    }, this);
		}
	},    

	getFirstEditorIndex: function () {
		for (var i = 0; i < this.columns.length; i++)
			if (this.columns[i].field)
				return i;
	},

	createEditingPlugin: function () {
		switch (this.editing) {
			case 'cell':
				this.cellEditing = this.createCellEditing();
				this.plugins.push(this.cellEditing);
				break;
			case 'row':
				this.rowEditing = this.createRowEditing();
				this.plugins.push(this.rowEditing);
				break;
		}
	},

	createCellEditing: function () {
		this.editingOptions = this.editingOptions || {};
		Ext.apply(this.editingOptions, {
			firstEditor: this.getFirstEditorIndex()
		});
		return Ext.create('Ext.grid.plugin.CellEditing', this.editingOptions);
	},

	createRowEditing: function () {
		this.editingOptions = this.editingOptions || {};
		this.editingOptions.firstEditor = this.getFirstEditorIndex();
		Ext.applyIf(this.editingOptions, this.defaultRowEditingOptions);
		return Ext.create('Ext.grid.plugin.RowEditing', this.editingOptions);
	},

	getNewRecordData: function() {
	    return {};
	},

	createNewRecord: function () {
	    var data = this.getNewRecordData() || {};
	    this.fireEvent('newrecord', this, data);
		return Ext.create(this.store.model, data);
	},

	convertStringActions: function (actions) {
		for (var i = 0; i < actions.length; i++)
			if (Ext.isString(actions[i])) {
				switch (this.editing) {
					case 'row': actions[i] = this.convertRowEditorAction(actions[i]); break;
					case 'cell': actions[i] = this.convertCellEditorAction(actions[i]); break;
					case 'form': actions[i] = this.convertFormEditorAction(actions[i]); break;
				}

				if (Ext.isString(actions[i]))
					actions[i] = this.convertStringAction(actions[i]);
			}
		return actions;
	},

	convertStringAction: function (action) {
		switch (action) {
			case 'save': return {
				text: Dextop.saveText,
				iconCls: this.getActionIconCls(action),
				scope: this,
				handler: function () {
					this.store.sync();
				}
			}
			case 'reload': return {
				text: Dextop.reloadText,
				iconCls: this.getActionIconCls(action),
				scope: this,
				handler: function () {
					this.store.load();
				}
			}
			case 'edit': return {
				text: Dextop.editText,
				enableOnSingle: true,
				key: [Ext.EventObject.ENTER],
				iconCls: this.getActionIconCls(action),
				scope: this,
				handler: function () {
					this.editRecord();
				}
			}
			case 'remove': return {
				text: Dextop.removeText,
				iconCls: this.getActionIconCls(action),
				key: [Ext.EventObject.NUM_MINUS, Ext.EventObject.DELETE],
				enableOnSingle: true,
				enableOnMulti: true,
				scope: this,
				handler: function () {
					this.cancelEditing();
					Dextop.confirm({
						msg: this.confirmDeleteText,
						scope: this,
						fn: function (btn) {
							if (btn == 'yes') {
								this.store.remove(this.getSelectedRecords());
							}
						}
					})
				}
			}
		}
		return action;
	},

	cancelEditing: function () {
		switch (this.editing) {
			case 'row':
				this.rowEditing.cancelEdit();
				break;
			case 'cell':
				this.cellEditing.cancelEdit();
				break;
		}
	},

	convertRowEditorAction: function (action) {
		switch (action) {
			case 'add': return {
				text: Dextop.addText,
				iconCls: this.getActionIconCls(action),
				scope: this,
				key: [Ext.EventObject.NUM_PLUS, Ext.EventObject.INSERT],
				handler: function () {
					var rec = this.createNewRecord();
					var index = this.store.getCount();
					this.store.insertPhantom(index, rec); //(by dextop) insert row without syncing
					this.editRecord(rec);
				}
			}
		}
		return action;
	},

	convertCellEditorAction: function (action) {
		switch (action) {
			case 'add': return {
				text: Dextop.addText,
				iconCls: this.getActionIconCls(action),
				scope: this,
				key: [Ext.EventObject.NUM_PLUS, Ext.EventObject.INSERT],
				handler: function () {
					var rec = this.createNewRecord();
					var index = this.store.getCount();
					this.store.insert(index, rec);
					this.editRecord(rec);
				}
			}
		}
		return action;
	},

	convertFormEditorAction: function (action) {
		switch (action) {
			case 'add': return {
				text: Dextop.addText,
				iconCls: this.getActionIconCls(action),
				scope: this,
				key: [Ext.EventObject.NUM_PLUS, Ext.EventObject.INSERT],
				handler: function () {
					var rec = this.createNewRecord();
					this.formEdit(rec, true);

				}
			}
		}
		return action;
	},

	editRecord: function (rec) {
		rec = rec || this.getSelectedRecord();
		if (rec)
			switch (this.editing) {
			case 'row': this.rowEdit(rec); break;
			case 'cell': this.cellEdit(rec); break;
			case 'form': this.formEdit(rec); break;
		}
	},

	cellEdit: function (rec) {
		this.cellEditing.cancelEdit();
		this.cellEditing.startEditByPosition({ row: this.store.indexOf(rec), column: this.cellEditing.firstEditor });
	},

	rowEdit: function (rec) {
		this.rowEditing.cancelEdit();
		this.rowEditing.startEdit(this.store.indexOf(rec), this.rowEditing.firstEditor);
	},

    formEdit: function (rec, insert) {
        this.editingOptions = this.editingOptions || {};
        if (!this.editingOptions.formItemsType)
            this.editingOptions.formItemsType = this.store.model.modelName.replace('.model.', '.form.');
        var formEditor = Ext.create('Dextop.ux.FormEditorWindow', Ext.apply({
            title: insert ? this.addText : this.editText,
            insert: insert,
            remote: this.remote,
            data: rec.data
        }, this.editingOptions));
        formEditor.on('save', function (w, form, fieldValues) {
            form.getForm().updateRecord(rec);
            if (insert) {
                var index = this.store.getCount();
                this.store.insert(index, rec);
            }
            w.close();
        }, this);
        formEditor.show();
    },

	getSelectedRecords: function () {
		return this.getSelectionModel().getSelection();
	},

	getSelectedRecord: function () {
		var s = this.getSelectedRecords();
		if (s && s.length > 0)
			return s[0];
		return undefined;
	},

	getActionIconCls: function (action) {
		return (this.actionIconClsPrefix || '') + action + (this.actionIconClsSuffix || '');
	}
});
