Ext.define('Showcase.demos.AdvancedExceptionHandlingWindow', {
	extend: 'Dextop.Window',
	width: 200,
	autoHeight: true,
	title: 'Dextop Remoting Callbacks',

	initComponent: function () {
		Ext.apply(this, {
			bodyStyle: 'padding: 5px',
			plain: true,
			items: [{
				xtype: 'button',
				text: 'Do Something',
				scope: this,
				handler: function () {
					this.remote.DoSomething({
						type: 'alert'
					});
				}
			}, {
				xtype: 'button',
				text: 'Try Something Else',
				scope: this,
				handler: function () {
					this.remote.TrySomethingElse({
						type: 'alert'
					});
				}
			}]
		});
		this.callParent(arguments);
	}
});