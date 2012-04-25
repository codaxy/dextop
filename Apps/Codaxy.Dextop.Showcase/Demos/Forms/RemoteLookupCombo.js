Ext.define('Showcase.demos.RemoteLookupCombo', {
	extend: 'Dextop.Window',
	width: 400,	
	title: 'Remote Lookup Field',

	initComponent: function () {

		Ext.apply(this, {
			layout: 'fit',
			items: {
				xtype: 'dextopform',
				bodyPadding: 5,
				itemId: 'form',				
				border: false,
				autoHeight: true,
				model: this.getNestedTypeName('.form.Form'),
				remote: this.remote,
				data: this.data
			},
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
		});

		this.callParent(arguments);
	}
});
