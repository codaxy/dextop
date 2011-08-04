Ext.define('Showcase.demos.FileUploadDemoWindow', {
    extend: 'Dextop.Window',
    width: 300,
    autoHeight: true,
    title: 'File Upload Demo',

    initComponent: function () {
        Ext.apply(this, {
            items: [{
                xtype: 'form',
                bodyStyle: 'padding: 10px',
                autoHeight: true,
                api: {
                    submit: Ext.bind(this.submit, this)
                },
                border: false,
                items: [{
                    labelAlign: 'top',
                    fieldLabel: 'File',
                    xtype: 'fileuploadfield',
                    anchor: '0'
                }],
                buttons: [{
                    text: 'Cancel',
                    scope: this,
                    handler: function () {
                        this.close();
                    }
                }, {

                    text: 'Send',
                    scope: this,
                    handler: function () {
                        this.down('form').getForm().submit();
                    }
                }]
            }]
        });
        this.callParent(arguments);
    },

    submit: function (form) {
        this.remote.UploadFile(form, function (r) {
            if (r && r.success)
                alert(r.result);
            else
                alert('failed');
        });
    }
});