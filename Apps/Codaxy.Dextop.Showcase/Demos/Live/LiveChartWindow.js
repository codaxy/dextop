Ext.ns('Showcase');

Ext.define('Showcase.demos.LiveChartWindow', {
    extend: 'Dextop.Window',
    width: 500,
    height: 500,

    title: 'Live Chart',

    initComponent: function () {
        var store = this.remote.createLiveStore('model', {
            autoLoad: true
        });

        Ext.apply(this, {
            layout: 'fit',
            items: {
                xtype: 'chart',
                store: store,               
                axes: [{
                    type: 'Category',                   
                    position: 'bottom',
                    fields: ['CPU'],
                    title: 'CPU'
                }, {
                    type: 'Numeric',
                    position: 'left',
                    fields: ['Usage'],
                    title: 'CPU Usage',
                    minimum: 0,
                    maximum: 100
                }],
                series: [{
                    type: 'column',
                    axis: 'left',
                    xField: 'CPU',
                    yField: 'Usage'
                }]
            }
        });

        this.callParent(arguments);

    }
});
