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

	initComponent: function () {

		this.addEvents(['save']);

		this.formConfig = this.formConfig || {};

		if (!this.formItemsType)
			throw 'FormEditor requires formItemsType property to be configured.';

		var items = Ext.create(this.formItemsType).getItems(Ext.apply({
			remote: this.remote,
			data: this.data
		}, this.formItemsConfig));

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

	updateRecord: function (rec) {
		this.form.getForm().updateRecord(rec);
	}
});