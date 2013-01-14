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
    buttons: undefined,

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
            buttons: Ext.isDefined(this.buttons) ? this.buttons : [{
                formBind: true,
                text: Dextop.saveText,
                scope: this,
                disabled: this.readOnly,
                handler: this.onSave
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

    onSave: function () {
        if (this.form.getForm().isValid()) {
            var values = this.form.getForm().getFieldValues();
            if (this.fireEvent('beforesave', this, this.form, values) !== false)
                this.fireEvent('save', this, this.form, values);
        }
    },

    applyReadOnlyOnItems: function (items) {
		var i;
        for (i = 0; i < items.length; i++) {
            items[i].readOnly = true
            if (Ext.isArray(items[i].items))
                this.applyReadOnlyOnItems(items[i].items);
        }
    },

    updateRecord: function (rec) {
        this.form.getForm().updateRecord(rec);
    }
});
