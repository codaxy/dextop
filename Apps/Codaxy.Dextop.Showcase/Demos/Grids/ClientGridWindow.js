Ext.ns('Showcase');

Ext.define('Showcase.demos.Launcher.ClientGridWindow', {
    extend: 'Showcase.demos.Launcher',
    launch: function () {
        var remoteId = Ext.id();
        var w = Ext.create('Showcase.demos.ClientGridWindow', {
            remote: {
                remoteId: remoteId
            }
        });
        w.show();
        this.session.remote.CreateDemoWindow('ClientGridWindow', remoteId, {
			failure: function() {            
                w.close();
                alert('failed');
            }
        });
    }
});

Ext.define('Showcase.demos.ClientGridWindow', {
	extend: 'Dextop.Window',	
	width: 500,
	height: 300,
	
	title: 'Client Grid Window',
	requires: 'Ext.grid.GridPanel',
	
	initComponent: function() {			
		
		var store = Ext.create('Ext.data.Store', {
			proxy: Ext.create('Dextop.data.Proxy', {
				remote: {
					remoteId: this.remote.getSubRemoteId('store')
				},
				model: 'Showcase.demos.ClientGridWindow.model.Model'
			}),
			autoLoad: true,
			model: 'Showcase.demos.ClientGridWindow.model.Model'
		});

		var columns = Dextop.createGridColumns('Showcase.demos.ClientGridWindow.columns.Model');

		var grid = new Ext.grid.GridPanel({
			border: false,
			store: store,
			columns: columns  
		});		
		
		Ext.apply(this, {	
			layout: 'fit',
			items: grid			
		});
		
		this.callParent(arguments);	
	}
});
