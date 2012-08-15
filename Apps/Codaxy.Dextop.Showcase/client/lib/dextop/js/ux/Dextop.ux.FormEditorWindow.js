Ext.namespace('Dextop');

Ext.define('Dextop.ux.FormEditorWindow', {
    extend: 'Ext.Window',

    title: 'Edit Record',

    modal: true,
    width: 400,
    autoHeight: true,

    formConfig: undefined,
    formItemsType: undefined,
    formItemsConfig: undefined,

    readOnly: undefined,

    initComponent: function () {

        this.addEvents(['save']);

        this.formConfig = this.formConfig || {};

        if (!this.formItemsType)
            throw 'FormEditor requires formItemsType property to be configured.';

        var items = Ext.create(this.formItemsType).getItems(Ext.apply({
            remote: this.remote,
            data: this.data
        }, this.formItemsConfig));

        if (this.readOnly)
            this.applyReadOnlyOnItems(items);

        this.form = Ext.create('Ext.form.Panel', Ext.applyIf(Ext.clone(this.formConfig), {
            bodyStyle: 'padding: 5px',
            border: false,
            items: items
        }));

        Ext.apply(this, {
            layout: 'fit',
            items: [this.form],
            buttons: [{
                formBind: true,
                text: Dextop.saveText,
                scope: this,
                handler: function () {
                    if (this.form.getForm().isValid()) {
                        var values = this.form.getForm().getFieldValues();
                        this.fireEvent('save', this, this.form, values);
                    }
                }
            }, {
                text: Dextop.cancelText,
                scope: this,
                handler: function () {
                    this.close();
                }
            }]
        });

        this.callParent();
    },

    applyReadOnlyOnItems: function (items) {
        for (i = 0; i < items.length; i++) {
            items[i].readOnly = true
            if (Ext.isArray(items[i].items))
                applyReadOnlyOnItems(items[i].items);
        }
    },

    updateRecord: function (rec) {
        this.form.getForm().updateRecord(rec);
    }
});