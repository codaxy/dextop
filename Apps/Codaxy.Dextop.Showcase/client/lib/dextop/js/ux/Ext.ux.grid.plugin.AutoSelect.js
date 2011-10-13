Ext.define('Ext.ux.grid.plugin.AutoSelect', {

	autoSelect: true,
	preserveSelection: true,
	firstLoad: true,

	constructor: function (config) {
		Ext.apply(this, config);
	},

	init: function (grid) {

		this.grid = grid;

		grid.mon(grid.store, 'load', this.restoreSelection, this);
		grid.mon(grid.store, 'write', this.restoreSelection, this);

		if (this.preserveSelection) {
			grid.mon(grid.store, 'beforeload', this.saveSelection, this);
			grid.mon(grid.store, 'beforesync', this.saveSelection, this);
		}
	},

	saveSelection: function () {
		if (this.firstLoad)
			this.firstLoad = false;
		else {
			var selModel = this.grid.getSelectionModel();
			if (selModel.getSelection)
				this.selection = selModel.getSelection();
		}
	},

	restoreSelection: function () {
		if (this.selection) {
			var selModel = this.grid.getSelectionModel();
			var newSelection = [];
			for (var i = 0; i < this.selection.length; i++) {
				var rec = this.selection[i];
				var nrec = this.grid.store.getById(rec.internalId);
				if (nrec)
					newSelection.push(nrec);
			}
			selModel.select(newSelection);
		} else {
			if (this.grid.store.getCount() > 0) {
				var rec = this.grid.store.getAt(0);
				this.grid.getSelectionModel().select(rec);
			}
		}
	}
});
