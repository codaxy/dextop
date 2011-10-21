Ext.define('Showcase.demos.ComplexFormWindow', {
	extend: 'Dextop.Window',
	width: 400,
	height: 350,
	title: 'Complex Form Showcase',

	initComponent: function () {

		var formFields = Ext.create('Showcase.demos.ComplexFormWindow.form.ComplexForm').getItems();

		Ext.apply(this, {
			layout: 'fit',
			items: {
				xtype: 'form',
				itemId: 'form',
				layout: 'fit',
				border: false,
				items: formFields
				
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
