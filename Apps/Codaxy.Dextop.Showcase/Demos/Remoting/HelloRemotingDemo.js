Ext.define('Showcase.demos.HelloRemotingWindow', {
    extend: 'Dextop.Window',
    width: 200,
    height: 150,
    title: 'Hello Remoting Demo',
    
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
				scope: this,
			},
            items: [{                
                text: 'Say Hello',                
                handler: function () {
                    this.remote.GetHelloWorldMessage(function (r) {
                        if (r && r.success)
                            alert(r.result);
                        else
                            alert('failed');
                    });
                }
            },{                
                text: 'Search for John Smith',                
                handler: function () {
                    this.remote.Search({FirstName: 'John',LastName: 'Smith'}, function (r) {
                        if (r && r.success)
                            alert(r.result);
                        else
                            alert('failed');
                    });
                }
            }, {                
				text: 'Request Server Notification',                
                handler: function () {
                    this.remote.RequestServerNotification(function (r) {
                        if (!r || !r.success)
                            alert('failed');
                    });
                }
            }]
        });
        this.callParent(arguments);
    },

    onServerMessage: function(m) {
    	if (m.type === 'alert')
    		alert(m.msg);	
    }
});