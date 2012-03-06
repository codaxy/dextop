Ext.define('Showcase.demos.LoginFormWindow', {
	extend: 'Dextop.Window',
	width: 250,
	autoHeight: true,
	title: 'Please Login',

	initComponent: function () {

		Ext.apply(this, {
			layout: 'fit',
			items: {
				xtype: 'dextopform',
				bodyStyle: 'padding: 5px',
				border: false,
				autoHeight: true,
				model: this.getNestedTypeName('.form.Login'),
				fieldDefaults: {
					labelWidth: 70
				},
				plugins: new Ext.ux.KeyMapPlugin(),
				keys: [{
					key: Ext.EventObject.ENTER,
					scope: this,
					handler: this.doLogin
				}]
			},
			buttons: [{
				text: 'Login',
				formBind: true,
				scope: this,
				handler: this.doLogin
			}]
		});

		this.callParent(arguments);
	},

	doLogin: function () {
		var form = this.down('form').getForm();
		if (form.isValid())
			this.remote.DoLogin(form.getFieldValues(), {
				type: 'alert',
				scope: this,
				prepare: function () { this.setLoading(true); },
				cleanup: function () { this.setLoading(false); },
				success: function (result) {
					this.close();
					alert(result);
				}
			});
	}
});
