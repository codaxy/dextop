Ext.ns('Showcase');

Ext.define('Showcase.demos.LiveGroupingGridWindow', {
    extend: 'Dextop.Window',
    width: 500,
    height: 300,

    title: 'Live Grouping Grid',
    requires: 'Ext.grid.GridPanel',
    maximizable: true,

    initComponent: function () {
        var store = this.remote.createLiveStore('model', {
            autoLoad: true,
            autoSort: true,            
            sorters: [{
            	property: 'Ticker',
                direction: 'DESC'
            }],
            groupField: 'Group'
        });

        var columns = this.remote.createGridColumns('model');

        var grid = Ext.create('Ext.grid.GridPanel', {
            store: store,
            columns: columns,
            features: [{ ftype: 'grouping' }],
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
