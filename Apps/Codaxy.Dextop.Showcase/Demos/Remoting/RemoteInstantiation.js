Ext.define('Showcase.demos.RemoteInstantiationWindow', {
	extend: 'Dextop.Window',
	width: 200,
	height: 80,
	title: 'Dextop Remote Instantiation',

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
				flex: 1,
				scope: this
			},
			items: [{
				text: 'Create Window',
				handler: function () {
					this.remote.Instantiate({
						type: 'Showcase.demos.RemoteInstantiationWindow',
						own: false
					}, null, {
						type: 'alert',
						success: function (config) {
							var win = Dextop.create(config, {
								title: 'Remote Instantiated Window',
								modal: true,
								x: this.x + 50,
								y: this.y + 50
							});
							win.show();
						}
					}, this);
				}
			}]
		});
		this.callParent(arguments);
	}
});