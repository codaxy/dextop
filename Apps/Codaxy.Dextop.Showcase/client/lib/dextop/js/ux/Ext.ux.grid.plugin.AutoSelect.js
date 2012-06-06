Ext.define('Ext.ux.grid.plugin.AutoSelect', {

    autoSelect: true,
    defaultLast: true,
    defaultFirst: false,
    preserveSelection: true,

    constructor: function (config) {
        Ext.apply(this, config);
    },

    init: function (grid) {

        this.firstLoad = grid.store.getCount() == 0; //this should be store.isLoaded()

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
                var nrec = this.grid.store.getById(rec.getId());
                if (nrec)
                    newSelection.push(nrec);
            }
            if (this.defaultLast && newSelection.length == 0 && this.grid.store.getCount() > 0)
                selModel.select(this.grid.store.getAt(this.grid.store.getCount() - 1));
            if (this.defaultFirst && newSelection.length == 0 && this.grid.store.getCount() > 0)
                selModel.select(this.grid.store.getAt(0));
            else if (newSelection.length > 0)
                selModel.select(newSelection[0])
			else 
				selModel.deselectAll();
        } else {
            if (this.grid.store.getCount() > 0) {
                var rec = this.grid.store.getAt(0);
                this.grid.getSelectionModel().select(rec);
            }
        }
    }
});
