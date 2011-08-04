Ext.define('Showcase.demos.AllFormFieldsWindow', {
	extend: 'Dextop.Window',
	width: 400,
	height: 350,
	title: 'All Form Fields',

	initComponent: function () {

		var formFields = Ext.create(this.getNestedTypeName('.form.Form')).getItems({
			remote: this.remote,
			data: this.data
		});

		Ext.apply(this, {
			layout: 'fit',			
			items: {
				xtype: 'form',
				itemId: 'form',
				layout: 'fit',
				border: false,
				items: formFields,
				buttons: [{
					text: 'Send',
					scope: this,
					handler: function () {
						var form = this.getComponent('form');
						if (!form.getForm().isValid())
							return;
						var data = form.getForm().getFieldValues();
						this.remote.Send(data, {
							type: 'alert',
							success: function () {
								Dextop.infoAlert('Form has been successfully submited.');
							}
						});
					}
				}]
			}
		});

		this.callParent(arguments);
	}
});
