Ext.ns('Showcase.demos');


Ext.define('Showcase.demos.WindowOnDemandWindow', {
	extend: 'Dextop.Window',

	autoWidth: true,
	autoHeight: true,
	title: 'Window On Demand',
	
	initComponent: function() {
		Ext.apply(this, {
			items: {
				xtype: 'button',
				text: 'Create Simple Window',
				margin: '5 5 5 5',
				scope: this,	
				handler: this.createSimpleWindow				
			}
		})
		
		this.callParent(arguments);
	},
	
	createSimpleWindow: function() {
		this.remote.CreateWindow('simple', {
			success: function(config) {
				var win = Dextop.create(config);
				win.show();
			}
		});
	}
});
