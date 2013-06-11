Ext.define('Showcase.demos.RemoteInstantiationWindow', {
	extend: 'Dextop.Window',
	width: 300,
	height: 250,
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
				text: 'Parameterless',
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
				text: 'Invoke using an alias',
				handler: function () {
					Dextop.getSession().remote.Instantiate('rinstant', null, {
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
					Dextop.getSession().remote.Instantiate('Showcase.demos.RemoteInstantiationWindow', [1, 2], {
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
				text: 'Specify params as a hash',
				handler: function () {
					Dextop.getSession().remote.Instantiate('Showcase.demos.RemoteInstantiationWindow', { a: 1, b: 2 }, {
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
				text: 'Send a hash',
				handler: function () {
					Dextop.getSession().remote.Instantiate('Showcase.demos.RemoteInstantiationWindow', { msg: 'Everything is allowed' }, {
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
			    text: 'Using a constructor route',
			    handler: function () {
			        Dextop.getSession().remote.Instantiate('rinstant/param', null, {
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