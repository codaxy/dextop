Ext.define('Showcase.demos.LinkedCombosWindow', {
	extend: 'Dextop.Window',
	width: 250,
	autoHeight: true,
	title: 'Linked Combos',

	initComponent: function () {

		var formFields = Ext.create(this.getNestedTypeName('.form.Form')).getItems({
			data: {
				Value1: 0
			},
			remote: this.remote
		});

		Ext.apply(this, {
			layout: 'fit',
			items: {
				xtype: 'form',
				bodyStyle: 'padding: 5px',
				border: false,
				autoHeight: true,
				items: formFields,
				buttons: [{
					text: 'Close',
					formBind: true,
					scope: this,
					handler: function () {
						this.close();
					}
				}]
			}
		});

		this.callParent(arguments);
	}
});
