Ext.define('Showcase.demos.FileUploadFormWindow', {
    extend: 'Dextop.Window',
    width: 300,
    autoHeight: true,
    title: 'File Upload Form',

    initComponent: function () {

        var formItems = Ext.create(this.getNestedTypeName('.form.Form')).getItems();

        Ext.apply(this, {
            items: [{
                xtype: 'form',
                bodyStyle: 'padding: 10px',
                autoHeight: true,
                api: {
                    submit: Ext.bind(this.submit, this)
                },
                border: false,
                fieldDefaults: {
                    labelAlign: 'top'  
                },
                items: formItems,
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
                        this.submit();
                    }
                }]
            }]
        });
        this.callParent(arguments);
    },

    submit: function (form) {
        var f = this.down('form').getForm();
        this.remote.SubmitForm(f, {
            type: 'alert',
            success: function (result) {
                Dextop.infoAlert(result);
            }
        });
    }
});