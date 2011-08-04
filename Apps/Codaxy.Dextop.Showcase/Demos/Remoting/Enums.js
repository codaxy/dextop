Ext.define('Showcase.demos.EnumDemoWindow', {
	extend: 'Dextop.Window',
	width: 300,
	autoHeight: true,
	title: 'Enum',

	initComponent: function () {
		Ext.apply(this, {
			items: [{
				layout: 'hbox',
				//bodyStyle: 'padding: 10px',
				autoHeight: true,
				border: false,
				defaults: {
					margins: '10 5 10 5'
				},
				items: [{
					xtype: 'button',
					text: 'Toggle',
					scope: this,
					handler: function () {
						this.remote.ToggleStatus({
							scope: this,
							type: 'alert',
							success: this.updateStatus 
						});
					}
				}, {
					xtype: 'button',
					text: 'Make Valid',
					scope: this,
					handler: function () {
						this.remote.SetStatus(Showcase.demos.EnumDemoStatus.Valid, {
							scope: this,
							type: 'alert',
							success: this.updateStatus
						});
					}
				}, {
					xtype: 'button',
					text: 'Make Invalid',
					scope: this,
					handler: function () {
						this.remote.SetStatus(Showcase.demos.EnumDemoStatus.Invalid, {
							scope: this,
							type: 'alert',
							success: this.updateStatus
						});
					}
				}, {
					xtype: 'label'
				}]
			}]
		});
		this.callParent(arguments);
	},

	updateStatus: function (status) {
		switch (status) {
			case Showcase.demos.EnumDemoStatus.Valid:
				this.down('label').setText('Valid');
				break;
			case Showcase.demos.EnumDemoStatus.Invalid:
				this.down('label').setText('Invalid');
				break;
		}
	}
});