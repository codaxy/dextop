Ext.define('Showcase.demos.MessageExceptionsWindow', {
	extend: 'Dextop.Window',
	width: 150,
	height: 150,
	title: 'Message Exceptions',

	initComponent: function () {

		Ext.apply(this, {
			bodyStyle: 'padding: 5px',
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			defaults: {
				xtype: 'button',
				margins: '3 3 3 3',
				flex: 1
			},
			items: [{
				text: 'Error',
				scope: this,
				handler: function () {
					this.remote.Error({ type: 'alert' });
				}
			}, {
				text: 'Warning',
				scope: this,
				handler: function () {
					this.remote.Warning({ type: 'alert' });
				}
			}, {
				text: 'Info',
				scope: this,
				handler: function () {
					this.remote.Info({ type: 'alert' });
				}
			}]
		});
		this.callParent(arguments);
	}
});