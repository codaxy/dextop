Ext.define('Showcase.demos.CheckboxGroupsWindow', {
	extend: 'Dextop.Window',
	width: 500,
	autoHeight: true,
	title: 'Checkbox Groups',

	initComponent: function () {

		var formFields = Ext.create(this.getNestedTypeName('.form.Form')).getItems();

		Ext.apply(this, {
			layout: 'fit',
			items: {
				xtype: 'form',
				bodyStyle: 'padding: 5px',
				border: false,
				autoHeight: true,
				items: formFields,				
				buttons: [{
					text: 'Send',
					formBind: true,
					scope: this,
					handler: function (btn) {
						var form = btn.up('form').getForm();
						if (form.isValid())
							this.remote.Send(form.getFieldValues(), {
								type: 'alert',
								scope: this,
								success: function (result) {
									Dextop.infoAlert('Form has been submited.');
								}
							});
					}
				}]
			}
		});

		this.callParent(arguments);
	}
});
