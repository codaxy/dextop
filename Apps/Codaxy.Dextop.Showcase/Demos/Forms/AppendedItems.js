Ext.define('Showcase.demos.AppendedItemsWindow', {
	extend: 'Dextop.Window',
	width: 400,
	autoHeight: true,
	title: 'Appended Items',

	initComponent: function () {

		var formFields = Ext.create(this.getNestedTypeName('.form.ComplexForm')).getItems({
			apply: {
				'LocateButton': {
					xtype: 'button',
					text: 'Locate',
					style: 'margin-left: 5px',
					width: 100,
					listeners: {
						'click': function() {
							alert('This button is added on the client side to a server side defined form.');
						}
					}
				}
			}
		});

		Ext.apply(this, {
			layout: 'fit',
			items: {
				xtype: 'form',
				bodyStyle: 'padding: 5px',
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
