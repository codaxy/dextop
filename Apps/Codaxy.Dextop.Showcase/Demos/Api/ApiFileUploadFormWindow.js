Ext.ns('Showcase');

Ext.define('Showcase.demos.Launcher.ApiFileUploadFormWindow', {
    extend: 'Showcase.demos.Launcher',
    launch: function () {
        var remoteId = Ext.id();
        var w = Ext.create('Showcase.demos.ApiFileUploadFormWindow', {});
        w.show();
    }
});

Ext.define('Showcase.demos.ApiFileUploadFormWindow', {
    extend: 'Ext.Window',

    width: 300,
    autoHeight: true,
    title: 'File Upload Form API',

    initComponent: function () {
        var formItems, form;        
        formItems = Ext.create('Showcase.demos.ApiFileUploadFormWindowController.form.Form').getItems();
        form = Ext.create('Ext.form.Panel', {
            bodyStyle: 'padding: 10px',
            autoHeight: true,
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
                    this.doSubmit();
                }
            }]
        });

        Ext.apply(this, {
            items: [form],
            form: form
        });

        this.callParent(arguments);
    },

    doSubmit: function () {
        var api, form;
        form = this.form.getForm();
        api = new Dextop.api('file-upload-form-window');
        api.SubmitForm(form, {
            type: 'alert',
            success: function (result) {
                Dextop.infoAlert(result);
            }
        });
    }
});