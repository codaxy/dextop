Ext.define('Showcase.demos.RemotingCallbacksWindow', {
	extend: 'Dextop.Window',
	width: 200,
	height: 300,
	title: 'Dextop Remoting Callbacks',

	initComponent: function () {

		var exception = Ext.create('Ext.form.Checkbox', {
			fieldLabel: 'Exception'
		});

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
			items: [exception, {				
				text: 'Callback Function',				
				handler: function () {
					this.remote.GetHelloWorldMessage(exception.getValue(), function (r) {
						if (r && r.success)
							alert(r.result);
						else
							alert('failed');
					}, this);
				}
			}, {				
				text: 'Callback Options',
				handler: function () {
					this.remote.GetHelloWorldMessage(exception.getValue(), {
						scope: this,
						success: function (result) { Dextop.infoAlert(result); },
						failure: function (result) {
							if (!result)
								alert('Communication error.');
							else
								alert(result.exception);
						}
					});
				}
			}, {				
				text: 'Alert on Error',				
				handler: function () {
					this.remote.GetHelloWorldMessage(exception.getValue(), {
						success: function (result) { Dextop.infoAlert(result); },
						type: 'alert'
					});
				}
			}, {				
				text: 'Error Notification',				
				handler: function () {
					this.remote.GetHelloWorldMessage(exception.getValue(), {
						success: function (result) { Dextop.notify(result); },
						type: 'notify'
					});
				}
			}, {
				text: 'Callback plus Special Events',				
				handler: function () {
					this.remote.GetHelloWorldMessage(exception.getValue(), {
						scope: this,
						type: 'alert',
						success: function (result) { Dextop.infoAlert(result) },
						prepare: function () {
							this.setLoading(true);
						},
						cleanup: function () {
							this.setLoading(false);
						}
					});
				}
			}, {
				text: 'Set Loading Mask',				
				handler: function () {
					this.remote.GetHelloWorldMessage(exception.getValue(), {
						scope: this,
						type: 'alert',
						success: function (result) { Dextop.infoAlert(result) },
						setLoading: true
					});
				}
			}, {
				text: 'Set Loading Mask on Viewport',				
				handler: function () {
					this.remote.GetHelloWorldMessage(exception.getValue(), {
						scope: this,
						type: 'alert',
						success: function (result) { Dextop.infoAlert(result) },
						setLoading: 'Please wait until the server responds...', 
						setLoadingTarget: Dextop.getSession().viewport //specific to Showcase application
					});
				}
			}]
		});
		this.callParent(arguments);
	}
});