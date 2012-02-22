Ext.define('Showcase.demos.RemoteInstantiationWindow', {
	extend: 'Dextop.Window',
	width: 200,
	height: 150,
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
				text: 'Create Parameterless Window',
				handler: function () {
					Dextop.getSession().remote.Instantiate('Showcase.demos.RemoteInstantiationWindow', null, {
						type: 'alert',
						scope: this,
						success: function (config) {
							var win = Dextop.create(config, {								
								modal: true,
								x: this.x + 50,
								y: this.y + 50
							});
							win.show();
						}
					});
				}
			}, {
				text: 'Specify params as an array',
				handler: function () {
					Dextop.getSession().remote.Instantiate('array-instantiation', [1, 2], {
						type: 'alert',
						scope: this,
						success: function (config) {
							var win = Dextop.create(config, {								
								modal: true,
								x: this.x + 50,
								y: this.y + 50
							});
							win.show();
						}
					});
				}
			}, {
				text: 'Send dictionary',
				handler: function () {
					Dextop.getSession().remote.Instantiate('dictionary-instantiation', { something: 1 }, {
						type: 'alert',
						scope: this,
						success: function (config) {
							var win = Dextop.create(config, {								
								modal: true,
								x: this.x + 50,
								y: this.y + 50
							});
							win.show();
						}
					});
				}
			}]
		});
		this.callParent(arguments);
	}
});