Ext.ns('Showcase');

Ext.define('Showcase.demos.Launcher.ApiFileDownloadWindow', {
    extend: 'Showcase.demos.Launcher',
    launch: function () {
        var remoteId = Ext.id();
        var w = Ext.create('Showcase.demos.ApiFileDownloadWindow', {});
        w.show();
    }
});

Ext.define('Showcase.demos.ApiFileDownloadWindow', {
    extend: 'Ext.Window',

    width: 300,
    autoHeight: true,
    title: 'File Download API',

    initComponent: function () {

        this.api = api = new Dextop.api('file-download-window');

        Ext.apply(this, {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                margins: '3 3 3 3',
                scope: this
            },
            bodyStyle: 'padding: 5px',
            items: [{
                xtype: 'textfield',
                fieldLabel: 'Name',
                allowBlank: false,
                labelWidth: 50,
            },{
                text: 'Download',
                xtype: 'button',
                flex: 1,
                handler: function () {
                    var options = {
                        name: this.down('textfield').getValue()
                    };
                    Dextop.downloadAttachment(this.api.getAjaxUrl(options));
                }
            }]

        });


        this.callParent(arguments);
    }
});