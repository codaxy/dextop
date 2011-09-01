Ext.ns('Showcase');

Ext.define('Showcase.demos.NotificationsWindow', {
	extend: 'Dextop.Window',
	width: 200,
	height: 180,

	title: 'Notifications',

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
				text: 'Alert',				
				handler: function () {
					Dextop.notify({
						alert: true,
						title: 'Hello',
						type: 'warning',
						message: 'This is an alert.'
					});
				}
			}, {				
				text: 'Popup',				
				handler: function () {
					Dextop.notify({						
						title: 'Hello',
						type: 'error',					
						message: 'This is an error notification.'
					});

					Dextop.notify({						
						title: 'Hello',
						type: 'warning',					
						message: 'This is a warning.'
					});

					Dextop.notify({						
						title: 'Hello',						
						message: 'This is a notification.'
					});
				}
			}, {				
				text: 'Sound',				
				handler: function () {
					Dextop.notify({						
						alert: true,
						type: 'error',
						title: 'Hello',	
						sound: true,						
						message: 'You should hear a sound.'
					});
				}
			}, {
				text: 'Server',
				handler: function() {
					this.remote.NotifyMe();
				}
			}]
		});		

		this.callParent(arguments);
	}
});
