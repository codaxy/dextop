Ext.ns('Showcase');

Ext.define('Showcase.demos.ChatWindow', {
	extend: 'Dextop.Window',
	width: 500,
	height: 500,

	title: 'Chat Room',
	requires: 'Ext.grid.GridPanel',

	initComponent: function () {
		var store = this.remote.createLiveStore('model', {
			autoLoad: true
		});

		var columns = this.remote.createGridColumns('model');

		var grid = Ext.create('Ext.grid.GridPanel', {
			store: store,
			columns: columns,
			region: 'center',
			border: false,
			viewConfig: {
                loadMask: false
			}
		});

		var formItems = Ext.create(this.getNestedTypeName('.form.ChatLine')).getItems({
			apply: {
				"Text": {
					listeners:{
						scope: this,
						specialkey: function(field, e) {
							if (e.getKey() == e.ENTER) 
								this.send();								
						}
					}
				}
			}
		});

		Ext.apply(this, {
			layout: 'border',
			items: [grid, {
				xtype: 'form',
				region: 'south',
				autoHeight: true,
                paddding: 10,
				items: formItems,
				buttonAlign: 'left',
				buttons: [{
					text: 'Send',
					scope: this,
					handler: this.send
				}, '->', {
					text: 'Close',
					scope: this,
					handler: function () {
						this.close();
					}
				}]
			}]
		});

		this.callParent(arguments);
	}, 
	
	send: function() {
		var form = this.down('form').getForm();
		if (!form.isValid())
			return;
		this.remote.EnterLine(form.getFieldValues());
		var tb = form.findField("Text");
		tb.setValue('');
		tb.focus();
	}
});
