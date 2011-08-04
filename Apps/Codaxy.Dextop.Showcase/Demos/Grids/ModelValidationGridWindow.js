Ext.ns('Showcase');

Ext.define('Showcase.demos.ModelValidationGridWindow', {
    extend: 'Dextop.Window',
    width: 500,
    height: 300,

    title: 'Grid Window',
    requires: 'Ext.grid.GridPanel',

    initComponent: function () {

        var store = this.remote.createStore('validationmodel', {
            autoLoad: true,
            autoSync: false
        });

        var columns = this.remote.createGridColumns('validationmodel');

        var grid = Ext.create('Ext.grid.GridPanel', {
            store: store,
            columns: columns,
            plugins: [new Ext.grid.plugin.CellEditing({
                clicksToEdit: 1
            })],
            tbar: [{
                text: 'Add',
                scope: this,
                handler: function () {
                    var rec = Ext.create(store.model, {});
                    store.insert(0, rec);
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
