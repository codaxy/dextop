Ext.define('Showcase.demos.RadioGroupsWindow', {
	extend: 'Dextop.Window',
	width: 500,
	autoHeight: true,
	title: 'Radio Groups',

	initComponent: function () {

		Ext.apply(this, {
			layout: 'fit',
			items: {
				xtype: 'dextopform',
				bodyStyle: 'padding: 5px',
				border: false,
				autoHeight: true,
				model: this.getNestedTypeName('.form.Form'),
                data: this.data			
			},
			buttons: [{
				text: 'Send',
				formBind: true,
				scope: this,
				handler: function (btn) {
					var form = this.down('form').getForm();
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
		});

		this.callParent(arguments);
	}
});
