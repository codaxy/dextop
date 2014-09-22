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
                xtype: 'cartesian',
                store: store,               
                axes: [{
                    type: 'category',                   
                    position: 'bottom',
                    fields: ['CPU'],
                    title: 'CPU'
                }, {
                    type: 'numeric',
                    position: 'left',
                    fields: ['Usage'],
                    title: 'CPU Usage',
                    minimum: 0,
                    maximum: 100
                }],
                series: [{
                    type: 'bar',
                    axis: 'left',
                    xField: 'CPU',
                    yField: 'Usage'
                }]
            }
        });

        this.callParent(arguments);

    }
});
