Ext.define('Showcase.demos.SharedLookupDataWindow', {
	extend: 'Dextop.Window',
	width: 250,
	autoHeight: true,
	title: 'Shared Lookup Data',

	initComponent: function () {

		var formFields = Ext.create(this.getNestedTypeName('.form.Form')).getItems({
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
				fieldDefaults: {
					labelWidth: 70
				},
				buttons: [{
					text: 'Close',
					scope: this,
					handler: function (btn) {
						this.close();
					}
				}]
			}
		});

		this.callParent(arguments);
	}
});
