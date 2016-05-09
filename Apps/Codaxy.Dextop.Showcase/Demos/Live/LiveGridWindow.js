Ext.ns('Showcase');

Ext.define('Showcase.demos.LiveGridWindow', {
    extend: 'Dextop.Window',
    width: 500,
    height: 300,

    title: 'Live Grid Window',
    requires: 'Ext.grid.GridPanel',
    maximizable: true,

    initComponent: function () {
        

        var columns = this.remote.createGridColumns('model');

        var store = this.remote.createLiveStore('model', {
            autoLoad: true,
            autoSort: true,
            sorters: [{
                property: 'Ticker',
                direction: 'DESC'
            }]
        });

        var grid = Ext.create('Ext.grid.GridPanel', {
            store: store,
            columns: columns,
            viewConfig: {
                loadMask: false
            }
        });

        Ext.apply(this, {
            layout: 'fit',
            items: grid
        });

        this.callParent(arguments);

    }
});
